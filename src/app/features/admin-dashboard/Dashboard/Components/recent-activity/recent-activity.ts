import { Component, Input, OnInit, OnChanges, effect, signal, inject, WritableSignal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DrugStatus } from '../../../../../shared/enums/drug-status';
import { Router } from '@angular/router';
import { AdminNotification, DrugRequestNotification, PharmacyRegistrationNotification } from '../../../../pharmacy-dashboard/Dashboard/Interface/activity-notification';
import { th } from 'date-fns/locale';
import { PharmacyStatus } from '../../../../../shared/enums/pharmacy-status';

@Component({
  selector: 'app-recent-activity',
  imports: [DatePipe],
  templateUrl: './recent-activity.html',
  styleUrls: ['./recent-activity.css']
})
export class RecentActivity {
  activityList: any[] = [];
  router: Router = inject(Router);
  private _notifications = signal<AdminNotification | null>(null);

  @Input() set notifications(value: AdminNotification | null) {
    this._notifications.set(value);
  }

  constructor() {
    effect((_notifications) => {
      this.prepareActivityList();
    });
  }

  prepareActivityList() {
    console.log('Received notifications:', this._notifications());
    if (!this._notifications()) return;
    this.activityList = [];

    // Add drug request notifications
    if (this._notifications()) {
      this.activityList.push(...(this._notifications()?.drugRequests.map((drug: DrugRequestNotification) => ({
        type: 'DrugRequest',
        drugID: drug.drugID,
        message: `${drug.pharmacyName} send a request to add ${drug.commonName} to PharmaLink Medicines`,
        isRead: drug.isRead,
        timestamp: drug.timestamp
      })) ?? []));
      this.activityList.push(...(this._notifications()?.pharmaciesRequests.map((pharmacy: PharmacyRegistrationNotification) => ({
        type: 'PharmacyRequest',
        pharmacyID: pharmacy.pharmacyID,
        message: `${pharmacy.name} has sent you a registration request on PharmaLink`,
        isRead: false,
        timestamp: pharmacy.joinedDate
      })) ?? []));
    }

    // Sort by timestamp descending
    this.activityList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }


  onNotificationClick(notif: any) {
    if (notif.type === 'DrugRequest') {
      this.router.navigate(['admin/medicinesmanagement']);
    } else if (notif.type === 'PharmacyRequest') {
      this.router.navigate(['admin/PharmaciesManagement']);
    }
  }



}