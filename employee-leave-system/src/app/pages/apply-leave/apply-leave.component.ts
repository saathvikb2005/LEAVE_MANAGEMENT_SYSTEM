import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeaveService, LeaveDetails } from '../../services/leave.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

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
  fullUser!: User;

  constructor(private leaveService: LeaveService, private userService: UserService) {}

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
        manager: this.fullUser.manager ?? { userId: 9 } // fallback to default manager
      }
    };

    this.leaveService.applyLeave(leaveRequest).subscribe({
      next: () => {
        alert('Leave applied successfully!');
        this.resetForm();
      },
      error: (err) => {
        alert('Error applying leave: ' + err.message);
        console.error(err);
      }
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0]; // "yyyy-MM-dd"
  }

  resetForm() {
    this.leaveType = '';
    this.startDate = '';
    this.endDate = '';
    this.reason = '';
  }
}
