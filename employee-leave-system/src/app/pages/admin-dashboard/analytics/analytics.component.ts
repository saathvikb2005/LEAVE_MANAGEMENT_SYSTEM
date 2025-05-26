import { Component, OnInit } from '@angular/core';
import { LeaveService, LeaveDetails } from '../../../services/leave.service';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsDashboardComponent implements OnInit {

  totalLeaves = 0;
  approvedLeaves = 0;
  rejectedLeaves = 0;
  pendingLeaves = 0;
  avgLeaveDuration = 0;

  pieChartData: any;
  pieChartType: ChartType = 'pie';
  pieChartOptions = {
    responsive: true,
    plugins: { 
      legend: { 
        position: 'bottom' as const 
      } 
    }
  };

  barChartData: any;
  barChartType: ChartType = 'bar';
  barChartOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true, precision: 0 } },
    plugins: { 
      legend: { 
        display: false 
      } 
    }
  };

  constructor(private leaveService: LeaveService) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.leaveService.getAllLeaves().subscribe((leaves: LeaveDetails[]) => {
      this.totalLeaves = leaves.length;

      // Calculate counts by status
      this.approvedLeaves = leaves.filter(l => l.status === 'APPROVED').length;
      this.rejectedLeaves = leaves.filter(l => l.status === 'REJECTED').length;
      this.pendingLeaves = leaves.filter(l => l.status === 'PENDING').length;

      // Average leave duration in days
      const durations = leaves
        .filter(l => l.startDate && l.endDate)
        .map(l => {
          const start = new Date(l.startDate);
          const end = new Date(l.endDate);
          // +1 to include end date
          return (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
        });
      this.avgLeaveDuration = durations.length
        ? +(durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1)
        : 0;

      // Pie chart data: status distribution
      this.pieChartData = {
        labels: ['PENDING', 'APPROVED', 'REJECTED'],
        datasets: [{
          data: [this.pendingLeaves, this.approvedLeaves, this.rejectedLeaves],
          backgroundColor: ['#ffc107', '#198754', '#dc3545']
        }]
      };

      // Bar chart: leaves over last 6 months based on appliedDate
      this.prepareLast6MonthsChart(leaves);
    });
  }

  prepareLast6MonthsChart(leaves: LeaveDetails[]) {
    const now = new Date();
    const months: string[] = [];
    const counts: number[] = [];

    // Build last 6 months labels (e.g., May, Apr, Mar...)
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toLocaleString('default', { month: 'short' }));
      counts.push(0);
    }

    leaves.forEach(l => {
      if (l.appliedDate) {
        const applied = new Date(l.appliedDate);
        const monthIndex = months.findIndex((m, idx) => {
          const dt = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
          return applied.getFullYear() === dt.getFullYear() && applied.getMonth() === dt.getMonth();
        });
        if (monthIndex >= 0) {
          counts[monthIndex]++;
        }
      }
    });

    this.barChartData = {
      labels: months,
      datasets: [{
        label: 'Leave Requests',
        data: counts,
        backgroundColor: '#0d6efd'
      }]
    };
  }
}
