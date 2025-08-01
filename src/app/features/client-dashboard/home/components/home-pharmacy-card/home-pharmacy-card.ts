import { Component, Input } from '@angular/core';
import { Ipharmacy } from '../../../shared/models/ipharmacy';

@Component({
  selector: 'app-home-pharmacy-card',
  imports: [],
  templateUrl: './home-pharmacy-card.html',
  styleUrl: './home-pharmacy-card.css'
})
export class HomePharmacyCard {
@Input() pharmacy!: Ipharmacy;
  isOpenNow(startHour?: string, endHour?: string): boolean {
    if (!startHour || !endHour) return false;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const [startH, startM] = startHour.split(':').map(Number);
    const [endH, endM] = endHour.split(':').map(Number);

    const currentTime = currentHour * 60 + currentMinute;
    const startTime = startH * 60 + startM;
    const endTime = endH * 60 + endM;

    return currentTime >= startTime && currentTime <= endTime;
  }
}
