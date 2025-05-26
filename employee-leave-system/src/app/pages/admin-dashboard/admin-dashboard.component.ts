import { ApplicationModule, Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterOutlet,ApplicationModule,RouterModule,NgChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {}
