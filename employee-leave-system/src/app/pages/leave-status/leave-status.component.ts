import { Component, OnInit } from '@angular/core';
import { LeaveService, LeaveDetails } from '../../services/leave.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-leave-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-status.component.html',
  styleUrls: ['./leave-status.component.css']
})
export class ViewLeaveStatusComponent implements OnInit {
  leaveApplications: LeaveDetails[] = [];
  userId: number = Number(localStorage.getItem('userId')); 

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.leaveService.getLeavesByUser(this.userId).subscribe({
      next: (leaves: LeaveDetails[]) => {
        this.leaveApplications = leaves;
      },
      error: (err: any) => {
        console.error('Failed to load leave applications', err);
      }
    });
  }

  onRefresh(): void {
    this.loadLeaves();
  }

  getStatusClass(status?: string): string {
    switch (status) {
      case 'APPROVED':
        return 'badge bg-success';
      case 'REJECTED':
        return 'badge bg-danger';
      case 'PENDING':
      default:
        return 'badge bg-warning text-dark';
    }
  }
}
