import { Component, OnInit } from '@angular/core';
import { LeaveDetails, LeaveService } from '../../../services/leave.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

interface LeaveRequest {
  leaveId: number;
  employeeName: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  startDate: Date;
  endDate: Date;
  userId: number;
}

@Component({
  selector: 'app-manage-leaves',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-leaves.component.html',
  styleUrls: ['./manage-leaves.component.css']
})
export class ManageLeavesComponent implements OnInit {

  leaveRequests: LeaveRequest[] = [];
  allUsers: User[] = [];
  totalEmployees = 0;
  employeesOnLeave = 0;
  employeesOnLeaveNames: string[] = [];

  fromDate: string = '';
  toDate: string = '';

  aiRecommendation: string = '';
  aiMessage: string = '';
  recommendationLeaveId: number | null = null;

  constructor(
    private leaveService: LeaveService,
    private userService: UserService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadLeaveRequests();
    this.userService.getAllUsers().subscribe(users => {
      this.allUsers = users;
      this.totalEmployees = users.length;
    });
  }

  loadLeaveRequests(): void {
    this.leaveService.getAllLeaves().subscribe((leaves: LeaveDetails[]) => {
      this.leaveRequests = leaves.map(l => ({
        leaveId: l.leaveId!,
        employeeName: l.user ? (l.user.fullName || l.user.username || 'Unknown') : 'Unknown',
        fromDate: this.formatDate(l.startDate),
        toDate: this.formatDate(l.endDate),
        reason: l.reason,
        status: l.status || 'PENDING',
        startDate: new Date(l.startDate),
        endDate: new Date(l.endDate),
        userId: l.user?.userId || 0
      }));
      this.calculateLeaveStats();
    });
  }

  approveLeave(leaveId: number): void {
    this.leaveService.updateLeaveStatus(leaveId, 'APPROVED').subscribe(() => {
      this.loadLeaveRequests();
    });
  }

  rejectLeave(leaveId: number): void {
    this.leaveService.updateLeaveStatus(leaveId, 'REJECTED').subscribe(() => {
      this.loadLeaveRequests();
    });
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  }

  calculateLeaveStats(): void {
    if (!this.fromDate || !this.toDate) {
      this.employeesOnLeave = 0;
      this.employeesOnLeaveNames = [];
      return;
    }

    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);

    const onLeaveMap = new Map<number, string>();

    this.leaveRequests.forEach(lr => {
      if (lr.status === 'APPROVED' && lr.startDate <= to && lr.endDate >= from) {
        onLeaveMap.set(lr.userId, lr.employeeName);
      }
    });

    this.employeesOnLeave = onLeaveMap.size;
    this.employeesOnLeaveNames = Array.from(onLeaveMap.values());
  }

  onDateChange(): void {
    this.calculateLeaveStats();
  }

  getAIRecommendation(leave: LeaveRequest): void {
    const payload = {
      total_employees: this.totalEmployees,
      employees_on_leave: this.employeesOnLeave,
      applied_leave: {
        userId: leave.userId,
        startDate: leave.startDate.toISOString().split('T')[0],
        endDate: leave.endDate.toISOString().split('T')[0],
        reason: leave.reason
      }
    };

    this.aiRecommendation = 'Loading...';
    this.aiMessage = '';
    this.recommendationLeaveId = leave.leaveId;

    this.http.post<{ recommendation: string }>(
      'http://localhost:5000/api/ai/user-recommend',
      payload
    )
    .pipe(
      catchError(err => {
        console.error('AI API error', err);
        this.aiRecommendation = 'Could not fetch recommendation';
        this.aiMessage = '';
        return of(null);
      })
    )
    .subscribe(res => {
      if (res) {
        this.aiRecommendation = res.recommendation;
        this.aiMessage = '';
      } else {
        this.aiRecommendation = 'No recommendation available';
        this.aiMessage = '';
      }
    });
  }
}
