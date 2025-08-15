import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

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
      .withUrl('http://localhost:5278/adminhub', {
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

      this.acceptanceNotification();
      this.rejectionNotification();

    } catch (err) {
      console.error("Error starting connection:", err);
    }
  }

  sendDrugRequestToAdmin(message: string) {
    return this.hubConnection.invoke('SendRequestToAdmin', message)
      .catch(err => console.error('Error sending drug request:', err));
  }

  sendRegistrationRequest(message: string) {
    return this.hubConnection.invoke('SendRegistrationRequest', message)
      .catch(err => console.error('Error sending registration request:', err));
  }

  acceptanceNotification(): void {
    this.hubConnection.on('DrugRequestAccepted', (message) => {
      console.log("your request has been accepted:", message);
    });
  }

  rejectionNotification(): void {
    this.hubConnection.on('DrugRequestRejected', (message) => {
      console.log("your request has been rejected:", message);
    });
  }

  async adminNotification(): Promise<void> {
    this.acceptanceNotification();
    this.rejectionNotification();
  }
}
