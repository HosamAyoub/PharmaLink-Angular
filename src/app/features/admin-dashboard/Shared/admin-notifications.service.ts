import { Injectable, signal } from '@angular/core';
import { ConfigService } from '../../../shared/services/config.service';
import { HttpClient } from '@angular/common/http';
import { APP_CONSTANTS } from '../../../shared/constants/app.constants';
import { error } from 'console';
import { AdminNotification } from '../../pharmacy-dashboard/Dashboard/Interface/activity-notification';

@Injectable({
  providedIn: 'root'
})
export class AdminNotificationsService {

  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;
  Notifications = signal<AdminNotification | null>(null);
  constructor(private http: HttpClient, private config: ConfigService) { }

  GetAdminNotifications() {
    const url = this.config.getApiUrl(this.ENDPOINTS.ADMIN_NOTIFICATIONS);
    this.http.get(url).subscribe((res: any) => {
      this.Notifications.set(res);
      console.log('Admin Notifications:', res);
    }, error => {
      console.error('Error fetching admin notifications:', error);
    });
  }

}
