import { Component } from '@angular/core';
import { DashboardHeader } from '../../../pharmacy-dashboard/Dashboard/Components/dashboard-header/dashboard-header';

@Component({
  selector: 'app-suspended-page',
  standalone: true,
  imports: [DashboardHeader],
  templateUrl: './suspended-page.component.html',
  styleUrl: './suspended-page.component.css'
})
export class SuspendedPageComponent {

}
