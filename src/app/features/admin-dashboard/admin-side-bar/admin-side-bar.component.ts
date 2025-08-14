import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-admin-side-bar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './admin-side-bar.component.html',
  styleUrls: ['./admin-side-bar.component.css']
})
export class AdminSideBarComponent {
  @Input() isSidebarOpen = true;
  @Output() toggle = new EventEmitter<void>();

  activeItem: string = 'medicines';
  systemStatus: string = 'Online';

  menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'speedometer2', route: '/admin/dashboard' },
    { id: 'orders', label: 'Orders', icon: 'cart', route: '/admin/orders' },
    { id: 'medicines', label: 'Medicines', icon: 'capsule', route: '/admin/medicinesmanagement' },
    { id: 'pharmacies', label: 'Pharmacies', icon: 'shop', route: '/admin/pharmacies' },
    { id: 'users', label: 'Users', icon: 'people', route: '/admin/users' },
    { id: 'settings', label: 'Settings', icon: 'gear', route: '/admin/settings' }
  ];

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.toggle.emit();
  }

  // Auto-close sidebar on small screens
  ngOnInit() {
    this.checkScreen();
    window.addEventListener('resize', this.checkScreen.bind(this));
  }

  checkScreen() {
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }

  onItemClick(itemId: string) {
    this.activeItem = itemId;
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }
}