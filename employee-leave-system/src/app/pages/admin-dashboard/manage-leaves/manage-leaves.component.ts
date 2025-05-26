import { Component, OnInit } from '@angular/core';
import { LeaveDetails, LeaveService } from '../../../services/leave.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LeaveRequest {
  leaveId: number;
  employeeName: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
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

  constructor(private leaveService: LeaveService) {}

  ngOnInit() {
    this.loadLeaveRequests();
  }

  loadLeaveRequests() {
    this.leaveService.getAllLeaves().subscribe((leaves: LeaveDetails[]) => {
      this.leaveRequests = leaves.map(l => ({
        leaveId: l.leaveId!,
        employeeName: l.user ? (l.user.fullName || l.user.username || 'Unknown') : 'Unknown',
        fromDate: this.formatDate(l.startDate),
        toDate: this.formatDate(l.endDate),
        reason: l.reason,
        status: l.status || 'PENDING'
      }));
    });
  }

  approveLeave(leaveId: number) {
    this.leaveService.updateLeaveStatus(leaveId, 'APPROVED').subscribe(() => {
      this.loadLeaveRequests();
    });
  }

  rejectLeave(leaveId: number) {
    this.leaveService.updateLeaveStatus(leaveId, 'REJECTED').subscribe(() => {
      this.loadLeaveRequests();
    });
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  }
}
