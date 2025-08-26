import { inject, Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { AdminNotificationsService } from './admin-notifications.service';
import { APP_CONSTANTS } from '../../../shared/constants/app.constants';
import { ConfigService } from '../../../shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class AdminSignalRService {

  toastservice: ToastService = inject(ToastService);
  AdminNotifi: AdminNotificationsService = inject(AdminNotificationsService);
  config: ConfigService = inject(ConfigService);
  private hubConnection!: signalR.HubConnection;

  startConnection() {
    const userData = localStorage.getItem('userData');
    const token = userData ? JSON.parse(userData)._token : '';
    const AdminReqUrl = this.config.getHubUrl(APP_CONSTANTS.API.ENDPOINTS.ADMIN_HUB);
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(AdminReqUrl, {
        accessTokenFactory: () => token || ''
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection.onreconnecting(err => {
      console.warn("SignalR reconnecting...", err);
    });

    this.hubConnection.onreconnected(id => {
      console.log("SignalR reconnected. Connection ID:", id);
    });

    this.hubConnection.onclose(err => {
      console.error("SignalR connection closed", err);
    });

    try {
      this.hubConnection
        .start()
        .then(() => {
          console.log("Connected to adminHub");
        })
        .catch(err => console.error("Error starting connection:", err));

      this.receiveRequestsFromPharmacy().subscribe({
        next: () => {
          //console.log("New drug request received");
          this.toastservice.showSuccess("New drug request received");
          this.AdminNotifi.GetAdminNotifications();
        }
      });
      this.newUserRegistration().subscribe({
        next: (message) => {
          //console.log("New pharmacy registration received:", message);
          this.toastservice.showSuccess(`${message}`);
          this.AdminNotifi.GetAdminNotifications();
        }
      });
    }
    catch (error) {
      console.error("Error starting connection:", error);
    }

  }


  newUserRegistration(): Observable<void> {
    return new Observable((observer) => {
      this.hubConnection.on('NewUserRegistration', (message) => {
        //console.log('Admin got new user registration:', message);
        observer.next(message);
      });
    });
  }

  sendAcceptanceToAll(message: string) {
    return this.hubConnection.invoke('SendAcceptanceToAll', message)
      .catch(err => console.error('Error sending acceptance:', err));
  }

  sendRejectionToPharmacy(pharmacyId: string, message: string) {
    return this.hubConnection.invoke('SendRejectionToPharmacy', pharmacyId, message)
      .catch(err => console.error('Error sending rejection:', err));
  }

  receiveRequestsFromPharmacy(): Observable<void> {
    return new Observable((observer) => {
      this.hubConnection.on('NewDrugRequest', (message) => {
        //console.log('Admin got request:', message);
        observer.next();
      });
    });
  }
}
