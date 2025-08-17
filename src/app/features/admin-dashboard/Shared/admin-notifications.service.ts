import { Injectable, signal } from '@angular/core';
import { ConfigService } from '../../../shared/services/config.service';
import { HttpClient } from '@angular/common/http';
import { APP_CONSTANTS } from '../../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AdminNotificationsService {

  private ENDPOINTS = APP_CONSTANTS.API.ENDPOINTS;
  Notifications = signal<any[]>([]);
  constructor(private http: HttpClient, private config: ConfigService) { }

  GetAdminNotifications() {
    const url = this.config.getApiUrl(this.ENDPOINTS.ADMIN_NOTIFICATIONS);
    this.http.get(url).subscribe((res: any) => {
      this.Notifications.set(res);
      console.log('Admin Notifications:', res);
    });
  }

}
