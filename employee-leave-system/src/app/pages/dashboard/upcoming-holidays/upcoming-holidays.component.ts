import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-upcoming-holidays',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './upcoming-holidays.component.html',
  styleUrls: ['./upcoming-holidays.component.css']
})
export class UpcomingHolidaysComponent implements OnInit {
  holidays = [
    { date: '2025-06-17', name: 'Bakrid' },
    { date: '2025-08-15', name: 'Independence Day' },
    { date: '2025-10-02', name: 'Gandhi Jayanti' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
