import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../shared/services/auth.service';

@Component({
  selector: 'app-dashboard-header',
  imports: [],
  templateUrl: './dashboard-header.html',
  styleUrl: './dashboard-header.css'
})
export class DashboardHeader implements OnInit{
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
