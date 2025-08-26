import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { Config } from '@fortawesome/fontawesome-svg-core';
import { ConfigService } from '../../../../shared/services/config.service';
import { App } from './../../../../app';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class RequestsSignalRService {

  config: ConfigService = inject(ConfigService);
  constructor() { }

  hubConnection!: signalR.HubConnection;

  async startConnection() {
    const userData = localStorage.getItem('userData');
    const token = userData ? JSON.parse(userData)._token : '';
    const AdminUrl = this.config.getHubUrl(APP_CONSTANTS.API.ENDPOINTS.ADMIN_HUB);


    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(AdminUrl, {
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
      await this.hubConnection.start();
      console.log("Connected to adminHub");

    } catch (err) {
      console.error("Error starting connection:", err);
    }
  }

  sendDrugRequestToAdmin(message: string) {
    return this.hubConnection.invoke('SendRequestToAdmin', message)
      .catch(err => console.error('Error sending drug request:', err));
  }

  sendRegistrationRequest(message: string): Observable<void> {
    return new Observable((observer) => {
      this.hubConnection.invoke('SendRegistrationRequest', message)
        .then(() => observer.next())
        .catch(err => {
          console.error('Error sending registration request:', err);
          observer.error(err);
        });
    });
  }

}
