import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class OrdersSignalrServiceService {
  public hubConnection!: signalR.HubConnection;
  showPopup = false;

  startConnection(pharmacyId: number) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5278/orderHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started');
        this.hubConnection.invoke("JoinGroup", pharmacyId.toString());
      })
      .catch(err => console.error('Error while starting connection: ' + err));
  }

  stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
