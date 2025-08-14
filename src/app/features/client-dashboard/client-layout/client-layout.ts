import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../../features/client-dashboard/shared/components/navbar/navbar';
import { Footer } from '../shared/components/footer/footer';
import { Router, NavigationEnd } from '@angular/router';
import { StatusChangeComponent } from "../shared/components/status-change/status-change.component";
import { SignalrService } from '../shared/services/signalr.service';

@Component({
  selector: 'app-client-layout',
  imports: [Navbar, Footer, RouterOutlet, StatusChangeComponent],
  templateUrl: './client-layout.html',
  styleUrl: './client-layout.css',
})
export class ClientLayout implements OnInit {

  signalrService = inject(SignalrService)
  ngOnInit(): void {
    this.signalrService.startConnection();
  }

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}
