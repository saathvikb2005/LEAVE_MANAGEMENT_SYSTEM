import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDetails {
  userId: number;
  username?: string;
  fullName?: string;
  manager?: { userId: number } | null;
}

export interface LeaveDetails {
  leaveId?: number;
  appliedDate?: string;
  user: UserDetails;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  managerComment?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private readonly apiUrl = 'http://localhost:8084/leave';

  constructor(private http: HttpClient) {}

  applyLeave(leave: LeaveDetails): Observable<LeaveDetails> {
    return this.http.post<LeaveDetails>(`${this.apiUrl}/apply`, leave);
  }

  getAllLeaves(): Observable<LeaveDetails[]> {
    return this.http.get<LeaveDetails[]>(`${this.apiUrl}/all`);
  }

  getLeavesByUser(userId: number): Observable<LeaveDetails[]> {
    return this.http.post<LeaveDetails[]>(`${this.apiUrl}/user`, { userId });
  }

  updateLeaveStatus(
  leaveId: number,
  status: 'APPROVED' | 'REJECTED',
  comment?: string
): Observable<LeaveDetails> {
  let params = new HttpParams().set('status', status.toUpperCase());
  if (comment?.trim()) {
    params = params.set('comment', comment.trim());
  }

  return this.http.put<LeaveDetails>(`${this.apiUrl}/status/${leaveId}`, null, { params });
}
}
