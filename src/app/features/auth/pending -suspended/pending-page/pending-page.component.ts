import { Component } from '@angular/core';
import { DashboardHeader } from '../../../pharmacy-dashboard/Dashboard/Components/dashboard-header/dashboard-header';

@Component({
  selector: 'app-pending-page',
  standalone: true,
  imports: [DashboardHeader],
  templateUrl: './pending-page.component.html',
  styleUrl: './pending-page.component.css'
})
export class PendingPageComponent {

}
