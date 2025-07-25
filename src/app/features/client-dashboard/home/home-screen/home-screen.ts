import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Slider } from "../components/slider/slider";
import { ServiceSection } from "../components/service-section/service-section";
import { CategorySection } from "../components/category-section/category-section";
import { Ipharmacy } from '../../Pharmacies/Interface/ipharmacy';
import { PharmacyService } from '../../Pharmacies/Service/pharmacy-service';
import { HomePharmacyCard } from '../components/home-pharmacy-card/home-pharmacy-card';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-home-screen',
  imports: [Slider, ServiceSection, CategorySection,HomePharmacyCard,RouterLink,SlicePipe],
  templateUrl: './home-screen.html',
  styleUrl: './home-screen.css'
})
export class HomeScreen implements OnInit{
protected pharmacies: Ipharmacy[] =[];
protected PharmaErrMessage: string | null = null;
  constructor(private pharmacyService: PharmacyService, private cdr:ChangeDetectorRef){}
  ngOnInit(): void {
    this.loadPharmacies();
  }
  
  loadPharmacies():void {
    this.pharmacyService.getPharmacies().subscribe({
      next: data => {
        this.pharmacies = data
        this.cdr.detectChanges(); // Ensure the view updates immediately
      },
      error: error=>{
        this.PharmaErrMessage = 'Failed to load pharmacies. Please try again later.';
        this.cdr.detectChanges();
      }
    });
  }
}

