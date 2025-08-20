import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestsSignalRService {

  constructor() { }

  hubConnection!: signalR.HubConnection;

  async startConnection() {
    const userData = localStorage.getItem('userData');
    const token = userData ? JSON.parse(userData)._token : '';

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5278/hubs/adminhub', {
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

  sendRegistrationRequest(message: string) : Observable<void> {
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
