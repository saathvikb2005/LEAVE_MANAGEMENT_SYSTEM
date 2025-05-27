import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeaveService, LeaveDetails } from '../../services/leave.service';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent implements OnInit {
  leaveType: string = '';
  startDate: string = '';
  endDate: string = '';
  reason: string = '';
  fullUser: any;

  // AI Recommendation related
  aiRecommendation: string = '';
  isLoadingRecommendation = false;

  // Suggested leave date ranges from AI
  suggestedLeaveRanges: { start: string; end: string }[] = [];

  totalEmployees: number = 0;
  employeesOnLeave: number = 0;

  constructor(
    private leaveService: LeaveService,
    private userService: UserService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      alert('User not logged in.');
      return;
    }

    this.userService.getUserById(userId).subscribe({
      next: (user) => this.fullUser = user,
      error: (err) => {
        alert('Failed to load user details');
        console.error(err);
      }
    });

    this.userService.getAllUsers().subscribe(users => {
      this.totalEmployees = users.length;
    });

    this.leaveService.getAllLeaves().subscribe(leaves => {
      const today = new Date();
      this.employeesOnLeave = leaves.filter(l =>
        l.status === 'APPROVED' &&
        new Date(l.startDate) <= today && new Date(l.endDate) >= today
      ).length;
    });
  }

  checkAIRecommendation() {
    if (!this.leaveType || !this.startDate || !this.endDate || !this.reason) {
      alert('Please fill all required fields first to get recommendation.');
      return;
    }

    this.isLoadingRecommendation = true;
    this.aiRecommendation = '';
    this.suggestedLeaveRanges = [];

    const appliedLeave = {
      leaveType: this.leaveType,
      startDate: this.startDate,
      endDate: this.endDate,
      reason: this.reason,
      userId: this.fullUser?.userId
    };

    const payload = {
      total_employees: this.totalEmployees,
      employees_on_leave: this.employeesOnLeave,
      applied_leave: appliedLeave
    };

    // Assuming backend returns data like:
    // { recommendation: string, suggested_dates: [{start: string, end: string}, ...] }
    this.http.post<{recommendation: string, suggested_dates: {start: string, end: string}[]}>(
      'http://127.0.0.1:5000/api/ai/user-recommend',
      payload
    ).subscribe({
      next: (resp) => {
        this.aiRecommendation = resp.recommendation;
        this.suggestedLeaveRanges = resp.suggested_dates || [];
        this.isLoadingRecommendation = false;
      },
      error: (err) => {
        alert('Failed to get AI recommendation.');
        console.error(err);
        this.isLoadingRecommendation = false;
      }
    });
  }

  // When user clicks a suggested leave date range, autofill the start/end date inputs
  useSuggestedDates(range: { start: string, end: string }) {
    this.startDate = range.start;
    this.endDate = range.end;
  }

  onSubmit() {
    if (!this.leaveType || !this.startDate || !this.endDate || !this.reason) {
      alert('Please fill all required fields.');
      return;
    }

    if (!this.fullUser || !this.fullUser.userId) {
      alert('User details not loaded properly.');
      return;
    }

    const leaveRequest: LeaveDetails = {
      leaveType: this.leaveType,
      startDate: this.formatDate(this.startDate),
      endDate: this.formatDate(this.endDate),
      reason: this.reason,
      user: {
        userId: this.fullUser.userId,
        username: this.fullUser.username,
        fullName: this.fullUser.name,
        manager: this.fullUser.manager ?? { userId: 9 }
      }
    };

    this.leaveService.applyLeave(leaveRequest).subscribe({
      next: () => {
        alert('Leave applied successfully!');
        this.resetForm();
        this.aiRecommendation = '';
        this.suggestedLeaveRanges = [];
      },
      error: (err) => {
        alert('Error applying leave: ' + err.message);
        console.error(err);
      }
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  }

  resetForm() {
    this.leaveType = '';
    this.startDate = '';
    this.endDate = '';
    this.reason = '';
  }
}
