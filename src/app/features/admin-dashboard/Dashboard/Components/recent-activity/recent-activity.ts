import { Component, Input, OnInit, OnChanges, effect, signal, inject, WritableSignal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DrugStatus } from '../../../../../shared/enums/drug-status';
import { Router } from '@angular/router';
import { DrugRequestNotification } from '../../../../pharmacy-dashboard/Dashboard/Interface/activity-notification';

@Component({
  selector: 'app-recent-activity',
  imports: [DatePipe],
  templateUrl: './recent-activity.html',
  styleUrls: ['./recent-activity.css']
})
export class RecentActivity {
  activityList: any[] = [];
  router: Router = inject(Router);
  private _notifications = signal<DrugRequestNotification[] | null>(null);

  @Input() set notifications(value: DrugRequestNotification[] | null) {
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
      this.activityList.push(...(this._notifications()?.map((drug: DrugRequestNotification) => ({
        drugID: drug.drugID,
        message: `${drug.pharmacyName} send a request to add ${drug.commonName} to PharmaLink Medicines`,
        isRead: drug.isRead,
        timestamp: drug.timestamp
      })) ?? []));
    }

    // Sort by timestamp descending
    this.activityList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }


  onNotificationClick(notif: any) {
    this.router.navigate(['admin/medicinesmanagement']);
  }



}