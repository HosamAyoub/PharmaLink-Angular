import { Component } from '@angular/core';
import { AdminSideBarComponent } from '../admin-side-bar/admin-side-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [AdminSideBarComponent, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayout {
  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  
}
