import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-admin-side-bar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './admin-side-bar.component.html',
  styleUrls: ['./admin-side-bar.component.css']
})
export class AdminSideBarComponent implements OnInit {
  @Input() isSidebarOpen = true;
  @Output() toggle = new EventEmitter<void>();

  activeItem: string = 'dashboard';
  systemStatus: string = 'Online';

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkScreen();
    window.addEventListener('resize', this.checkScreen.bind(this));
    this.setActiveItemByRoute();
    this.router.events.subscribe(() => {
      this.setActiveItemByRoute();
    });
  }

  setActiveItemByRoute() {
    const currentRoute = this.router.url;
    const found = this.menuItems.find(item => currentRoute.startsWith(item.route));
    if (found) {
      this.activeItem = found.id;
    }
  }

  menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'speedometer2', route: '/admin/dashboard' },
    { id: 'orders', label: 'Orders', icon: 'cart', route: '/admin/orders' },
    { id: 'medicines', label: 'Medicines', icon: 'capsule', route: '/admin/medicinesmanagement' },
    { id: 'pharmacies', label: 'Pharmacies', icon: 'shop', route: '/admin/PharmaciesManagement' },
    { id: 'users', label: 'Users', icon: 'people', route: '/admin/users' },
    { id: 'settings', label: 'Settings', icon: 'gear', route: '/admin/settings' }
  ];

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.toggle.emit();
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