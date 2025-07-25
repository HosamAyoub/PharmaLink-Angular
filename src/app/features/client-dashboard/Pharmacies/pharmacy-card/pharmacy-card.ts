import { Component, Input, OnInit } from '@angular/core';
import { PharmacyService } from '../Service/pharmacy-service';
import { Ipharmacy } from '../Interface/ipharmacy';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-pharmacy-card',
  imports: [DecimalPipe],
  templateUrl: './pharmacy-card.html',
  styleUrl: './pharmacy-card.css'
})
export class PharmacyCard {
  
  @Input() pharmacy!: Ipharmacy;

getStars(rate: number | undefined): string {
  if (!rate) return '';
  
  const fullStars = Math.floor(rate);
  const hasHalfStar = rate % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    '<span class="full-star">★</span>'.repeat(fullStars) +
    (hasHalfStar ? '<span class="half-star">✫</span>' : '') +
    '<span class="empty-star">☆</span>'.repeat(emptyStars)
  );
}

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


