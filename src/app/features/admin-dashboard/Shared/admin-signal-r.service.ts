import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminSignalRService {

  private hubConnection!: signalR.HubConnection;

  startConnection() {
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

    try
    {
      this.hubConnection
      .start()
      .then(() => {
        console.log("Connected to adminHub");
      })
      .catch(err => console.error("Error starting connection:", err));

    this.receiveRequestsFromPharmacy();
    }
    catch (error) {
      console.error("Error starting connection:", error);
    }
    
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
        console.log('Admin got request:', message);
        observer.next();
      });
    });
  }
}
