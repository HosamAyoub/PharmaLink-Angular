import { Component } from '@angular/core';
import { Navbar } from "../../../features/client-dashboard/shared/components/navbar/navbar";
import { AdminDashboardRoutingModule } from "../../../features/admin-dashboard/admin-dashboard-routing.module";

@Component({
  selector: 'app-client-layout',
  imports: [Navbar, AdminDashboardRoutingModule],
  templateUrl: './client-layout.html',
  styleUrl: './client-layout.css'
})
export class ClientLayout {

}
