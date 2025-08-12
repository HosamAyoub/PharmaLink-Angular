import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-side-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-side-bar.component.html',
  styleUrls: ['./admin-side-bar.component.css']
})
export class AdminSideBarComponent {
  activeItem: string = 'medicines';
  systemStatus: string = 'Online';
  isSidebarOpen = false;

  menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'speedometer2' },
    { id: 'orders', label: 'Orders', icon: 'cart' },
    { id: 'medicines', label: 'Medicines', icon: 'capsule' },
    { id: 'pharmacies', label: 'Pharmacies', icon: 'shop' },
    { id: 'users', label: 'Users', icon: 'people' },
    { id: 'settings', label: 'Settings', icon: 'gear' }
  ];

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onItemClick(itemId: string) {
    this.activeItem = itemId;
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }
}