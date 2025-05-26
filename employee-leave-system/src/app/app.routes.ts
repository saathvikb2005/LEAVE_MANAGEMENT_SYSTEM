import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ApplyLeaveComponent } from './pages/apply-leave/apply-leave.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ManageLeavesComponent } from './pages/admin-dashboard/manage-leaves/manage-leaves.component';
import { AnalyticsDashboardComponent } from './pages/admin-dashboard/analytics/analytics.component';
import { CalendarComponent } from './pages/admin-dashboard/calendar/calendar.component';
import { HttpClientModule } from '@angular/common/http';
import { ViewLeaveStatusComponent } from './pages/leave-status/leave-status.component';


export const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'apply-leave', component: ApplyLeaveComponent },
  { path: 'leave-status', component: ViewLeaveStatusComponent },
  { path: 'profile', component: ProfileComponent },

  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    children: [
      { path: 'manage-leaves', component: ManageLeavesComponent },
      { path: 'analytics', component: AnalyticsDashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: '', redirectTo: 'manage-leaves', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}
