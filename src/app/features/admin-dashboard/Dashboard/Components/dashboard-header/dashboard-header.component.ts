import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../shared/services/auth.service';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css'
})
export class DashboardHeaderComponent implements OnInit{
 constructor(private authservice: AuthService) {}
  userName: string | undefined;
  formattedDate: string | undefined;

  ngOnInit(): void {    
    this.userName = this.authservice.user()?.userName;
    const today = new Date();
    this.formattedDate = today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }
}