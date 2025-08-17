 import { Component } from '@angular/core';
import { AdminSideBarComponent } from '../admin-side-bar/admin-side-bar.component';
import { RouterOutlet } from '@angular/router';
import { SidebarStateServiceService } from '../Shared/sidebar-state-service.service';
import { AsyncPipe, CommonModule } from '@angular/common';

  @Component({
    selector: 'app-admin-layout',
    imports: [AdminSideBarComponent, RouterOutlet,AsyncPipe],
    templateUrl: './admin-layout.html',
    styleUrls: ['./admin-layout.css']
  })
  export class AdminLayout {
  constructor(public sidebarService: SidebarStateServiceService) {}

  get isSidebarOpen() {
    return this.sidebarService.isOpen$;
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  
}