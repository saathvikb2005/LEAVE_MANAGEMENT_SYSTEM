import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { UpcomingHolidaysComponent } from './upcoming-holidays/upcoming-holidays.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule,CalendarComponent,UpcomingHolidaysComponent], 
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
