import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SidebarStateServiceService } from '../Shared/sidebar-state-service.service';
import { AuthService } from '../../../shared/services/auth.service';


@Component({
  selector: 'app-admin-side-bar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './admin-side-bar.component.html',
  styleUrls: ['./admin-side-bar.component.css']
})
export class AdminSideBarComponent implements OnInit {
  @Output() toggle = new EventEmitter<void>();

  activeItem: string = 'dashboard';
  systemStatus: string = 'Online';

  constructor(private router: Router,public sidebarService: SidebarStateServiceService,private authservice: AuthService) {}

  ngOnInit() {
    this.checkScreen();
    window.addEventListener('resize', this.checkScreen.bind(this));
    this.setActiveItemByRoute();
    this.router.events.subscribe(() => {
      this.setActiveItemByRoute();
    });
  }
  logout() {
    this.authservice.logout();
  }

  setActiveItemByRoute() {
    const currentRoute = this.router.url;
    const found = this.menuItems.find(item => currentRoute.startsWith(item.route));
    if (found) {
      this.activeItem = found.id;
    }
  }
  get isSidebarOpen() {
    return this.sidebarService.isOpen$;
  }

  menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'speedometer2', route: '/admin/dashboard' },
    { id: 'orders', label: 'Orders', icon: 'cart', route: '/admin/orders' },
    { id: 'medicines', label: 'Medicines', icon: 'capsule', route: '/admin/medicinesmanagement' },
    { id: 'pharmacies', label: 'Pharmacies', icon: 'shop', route: '/admin/PharmaciesManagement' },
  ];

 toggleSidebar() {
    this.sidebarService.toggle();
  }



  checkScreen() {
    if (window.innerWidth <= 768) {
      this.sidebarService.setState(false);
    }
  }

 onItemClick(itemId: string) {
    this.activeItem = itemId;
    if (window.innerWidth <= 768) {
      this.sidebarService.setState(false);
    }
  }
}