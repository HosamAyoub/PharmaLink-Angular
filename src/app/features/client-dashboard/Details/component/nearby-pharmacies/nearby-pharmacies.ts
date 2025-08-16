import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, signal, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Loader } from '@googlemaps/js-api-loader';
import { Ipharmacy } from '../../../shared/models/ipharmacy';
import { PharmacyService } from '../../../Pharmacies/Service/pharmacy-service';
import { PharmacyProductDetialsService } from '../../../pharamcy-product-details/services/pharmacy-product-detials-service';
import { IPharmaStock } from '../../model/IPharmaDrug';
import { environment } from '../../../../../../environments/environment';


export interface NearbyPharmacy {
  id: number;
  name: string;
  distance: string;
  price: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  statusText: string;
}


@Component({
  selector: 'app-nearby-pharmacies',
  imports: [CommonModule],
  templateUrl: './nearby-pharmacies.html',
  styleUrl: './nearby-pharmacies.css'
})
export class NearbyPharmacies implements OnInit, AfterViewInit, OnChanges {
  nearestPharmacies = signal<IPharmaStock[]>([]);
  pharmacyProductDetialsService = inject(PharmacyProductDetialsService);
  @Input() selectedDrugId: number = 0;
  @Input() pharmacies: IPharmaStock[] = [];
  private mapInitialized = false;

  constructor(private pharmacyService: PharmacyService) { }

  ngOnInit(): void {
    console.log('NearbyPharmacies component initialized');
    console.log('Initial pharmacies input:', this.pharmacies);
    // Use input pharmacies data instead of fetching from service
    this.nearestPharmacies.set(this.pharmacies);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pharmacies']) {

      this.nearestPharmacies.set(this.pharmacies);

      // Initialize or re-initialize map with new data
      if (this.pharmacies && this.pharmacies.length > 0) {
        setTimeout(() => {
          if (this.mapInitialized) {
            this.createMap();
          } else {
            this.initializeMap();
          }
        }, 100);
      }
    }
  }

  ngAfterViewInit(): void {
    console.log('NearbyPharmacies view initialized');
    console.log('Pharmacies available at view init:', this.nearestPharmacies());

    // Only initialize map if we have pharmacy data, otherwise wait for ngOnChanges
    if (this.pharmacies && this.pharmacies.length > 0) {
      setTimeout(() => {
        this.initializeMap();
      }, 100);
    } else {
      console.log('No pharmacy data available yet, waiting for input changes...');
    }
  }

  initializeMap(): void {
    if (this.mapInitialized) {
      console.log('Map already initialized');
      return;
    }

    // Check if Google Maps is already loaded globally
    if (typeof google !== 'undefined' && google.maps) {
      console.log('Google Maps already loaded globally, initializing directly...');
      this.createMap();
      return;
    }

    // Use loader if Google Maps is not loaded
    let loader = new Loader({
      apiKey: environment.googleMapsApiKey, // Use API key from environment
      version: 'weekly'
    });

    loader.load().then(() => {
      console.log('Google Maps loaded via Loader...');
      this.createMap();
    }).catch(error => {
      console.error('Error loading Google Maps:', error);
      this.mapInitialized = false;
    });
  }


  private createMap(): void {
    const mapElement = document.getElementById('map');

    if (mapElement) {
      console.log('Map element found, initializing map...');
      this.mapInitialized = true;
      // ITI Fayoum Branch coordinates
      const position = { lat: 29.323379349390862, lng: 30.838273256448545 };

      const map = new google.maps.Map(mapElement, {
        center: position,
        zoom: 16, // Higher zoom for tighter focus
        maxZoom: 18, // Allow closer zoom if needed
        minZoom: 15, // Prevent zooming out too far
        styles: [],
        disableDefaultUI: false, // Keep default UI controls
        mapTypeControl: false, // Remove map type selector
        streetViewControl: false, // Remove street view control
      });

      // Add 1km radius circle around ITI location
      const circle = new google.maps.Circle({
        strokeColor: '#2196F3', // Blue color for the circle
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#2196F3',
        fillOpacity: 0.1,
        map: map,
        center: position,
        radius: 1000, // 1000 meters = 1km
      });

      // Main marker (ITI Fayoum) - more prominent
      const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: 'معهد تكنولوجيا المعلومات ITI - Fayoum Branch',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Blue marker for ITI
          scaledSize: new google.maps.Size(40, 40) // Larger size for main location
        }
      });

      // Add label for ITI marker
      this.createITILabel(map, position, 'ITI Fayoum');

      const mainInfoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family: Arial, sans-serif;">
            <h4 style="margin: 0 0 5px 0; color: #333;"><b>معهد تكنولوجيا المعلومات ITI</b></h4>
            <p style="margin: 0; color: #666; font-size: 12px;">Fayoum Branch</p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        mainInfoWindow.open(map, marker);
      });

      // Add markers for nearest pharmacies (only within 1km)
      this.addPharmacyMarkers(map, position);
      console.log('Map initialized successfully');

      // Trigger resize event to ensure map renders correctly
      setTimeout(() => {
        google.maps.event.trigger(map, 'resize');
        map.setCenter(position);
      }, 100);
    } else {
      console.error("Map element with id 'map' not found.");
    }
  }

  // Method commented out since we now use input data from parent component
  // getNearestPharmacies(){
  //   console.log('Getting nearest pharmacies...');
  //   const position = { lat: 29.32353360394058, lng: 30.838584748642194 };
  //   this.pharmacyProductDetialsService.getNearestPharmacies(position.lat, position.lng, this.selectedDrugId).subscribe({
  //     next: (pharmacies) => {
  //       this.nearestPharmacies.set(pharmacies);
  //       console.log('Nearest pharmacies loaded:', this.nearestPharmacies());
  //       // Initialize map after getting pharmacy data
  //       this.initializeMap();
  //     },
  //     error: (error) => {
  //       console.error('Error fetching nearest pharmacies:', error);
  //       // Initialize map even if pharmacy data fails to load
  //       this.initializeMap();
  //     }
  //   });
  // }

  private addPharmacyMarkers(map: google.maps.Map, centerPosition: { lat: number; lng: number }): void {
    const pharmacies = this.nearestPharmacies();

    if (pharmacies.length === 0) {
      console.log('No pharmacies found to display on map');
      return;
    }

    let markerIndex = 1;

    pharmacies.forEach((pharmacy) => {
      // Check if pharmacy has valid coordinates
      const pharmacyPosition = this.getPharmacyCoordinates(pharmacy);

      if (pharmacyPosition) {
        // Calculate distance and only show pharmacies within 1km
        const distance = this.haversineDistance(centerPosition, pharmacyPosition);

        if (distance <= 1.0) { // Only show pharmacies within 1km
          const marker = new google.maps.Marker({
            position: pharmacyPosition,
            map: map,
            title: pharmacy.pharma_Name,
            label: markerIndex.toString(),
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // Pharmacy marker icon
              scaledSize: new google.maps.Size(32, 32)
            }
          });

          // Add pharmacy name label above the marker
          this.createPharmacyLabel(map, pharmacyPosition, pharmacy.pharma_Name);

          const statusText = pharmacy.quantityAvailable > 0 ? 'In Stock' : 'Out of Stock';
          const statusColor = pharmacy.quantityAvailable > 0 ? '#28a745' : '#dc3545';

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="max-width: 250px; font-family: Arial, sans-serif;">
                <h4 style="margin: 0 0 10px 0; color: #333;"><b>${pharmacy.pharma_Name}</b></h4>
                <p style="margin: 5px 0;"><strong>Address:</strong> ${pharmacy.pharma_Address}</p>
                <p style="margin: 5px 0;"><strong>Price:</strong> $${pharmacy.price}</p>
                <p style="margin: 5px 0;"><strong>Available:</strong> <span style="color: ${statusColor}; font-weight: bold;">${pharmacy.quantityAvailable} units</span></p>
                <p style="margin: 5px 0;"><strong>Distance:</strong> ${distance.toFixed(2)} km from ITI</p>
              </div>
            `,
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          markerIndex++;
        }
      }
    });

    console.log(`Displayed ${markerIndex - 1} pharmacies within 1km radius`);
  }

  private createPharmacyLabel(map: google.maps.Map, position: { lat: number; lng: number }, name: string): void {
    // Create a custom overlay for the pharmacy name label
    const labelDiv = document.createElement('div');
    labelDiv.style.cssText = `
      position: absolute;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 4px 8px;
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 11px;
      font-weight: 600;
      color: #333;
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
      white-space: nowrap;
      z-index: 1000;
      transform: translate(-50%, -100%);
      margin-top: -45px;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    `;

    // Truncate long names
    const displayName = name.length > 15 ? name.substring(0, 12) + '...' : name;
    labelDiv.textContent = displayName;

    // Add hover effects
    labelDiv.addEventListener('mouseenter', () => {
      labelDiv.style.background = 'rgba(33, 150, 243, 0.95)';
      labelDiv.style.color = 'white';
      labelDiv.style.transform = 'translate(-50%, -100%) scale(1.05)';
      labelDiv.style.transition = 'all 0.2s ease';
    });

    labelDiv.addEventListener('mouseleave', () => {
      labelDiv.style.background = 'rgba(255, 255, 255, 0.95)';
      labelDiv.style.color = '#333';
      labelDiv.style.transform = 'translate(-50%, -100%) scale(1)';
    });

    // Create custom overlay class
    class CustomLabel extends google.maps.OverlayView {
      private div: HTMLElement;
      private position: google.maps.LatLng;

      constructor(position: google.maps.LatLng, element: HTMLElement) {
        super();
        this.position = position;
        this.div = element;
      }

      override onAdd() {
        const panes = this.getPanes();
        if (panes) {
          panes.overlayLayer.appendChild(this.div);
        }
      }

      override draw() {
        const projection = this.getProjection();
        if (projection) {
          const point = projection.fromLatLngToDivPixel(this.position);
          if (point) {
            this.div.style.left = point.x + 'px';
            this.div.style.top = point.y + 'px';
          }
        }
      }

      override onRemove() {
        if (this.div && this.div.parentNode) {
          this.div.parentNode.removeChild(this.div);
        }
      }
    }

    // Create and add the label overlay
    const label = new CustomLabel(new google.maps.LatLng(position.lat, position.lng), labelDiv);
    label.setMap(map);
  }

  private createITILabel(map: google.maps.Map, position: { lat: number; lng: number }, name: string): void {
    // Create a custom overlay for the ITI name label with distinctive styling
    const labelDiv = document.createElement('div');
    labelDiv.style.cssText = `
      position: absolute;
      background: linear-gradient(135deg, #2196F3, #1976D2);
      border: 1px solid #1565C0;
      border-radius: 6px;
      padding: 4px 8px;
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 11px;
      font-weight: 600;
      color: white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      white-space: nowrap;
      z-index: 1001;
      transform: translate(-50%, -100%);
      margin-top: -50px;
      text-align: center;
    `;
    labelDiv.textContent = name;

    // Create custom overlay class (reuse the same class structure)
    class CustomLabel extends google.maps.OverlayView {
      private div: HTMLElement;
      private position: google.maps.LatLng;

      constructor(position: google.maps.LatLng, element: HTMLElement) {
        super();
        this.position = position;
        this.div = element;
      }

      override onAdd() {
        const panes = this.getPanes();
        if (panes) {
          panes.overlayLayer.appendChild(this.div);
        }
      }

      override draw() {
        const projection = this.getProjection();
        if (projection) {
          const point = projection.fromLatLngToDivPixel(this.position);
          if (point) {
            this.div.style.left = point.x + 'px';
            this.div.style.top = point.y + 'px';
          }
        }
      }

      override onRemove() {
        if (this.div && this.div.parentNode) {
          this.div.parentNode.removeChild(this.div);
        }
      }
    }

    // Create and add the ITI label overlay
    const label = new CustomLabel(new google.maps.LatLng(position.lat, position.lng), labelDiv);
    label.setMap(map);
  }

  private getPharmacyCoordinates(pharmacy: IPharmaStock): { lat: number; lng: number } | null {
    // Since IPharmaStock doesn't have coordinates, we'll generate mock coordinates
    // based on pharmacy location for demo purposes
    const mockCoordinates = this.generateMockCoordinates(pharmacy.pharma_Name);

    if (mockCoordinates) {
      return mockCoordinates;
    }

    // If no coordinates are available, skip this pharmacy
    console.warn(`Pharmacy ${pharmacy.pharma_Name} has no coordinate data`);
    return null;
  }

  private generateMockCoordinates(pharmacyName: string): { lat: number; lng: number } | null {
    // Generate mock coordinates around ITI Fayoum (within 1km radius)
    const ITI_LAT = 29.323379349390862;
    const ITI_LNG = 30.838273256448545;

    // Create a simple hash from pharmacy name to ensure consistent coordinates
    let hash = 0;
    for (let i = 0; i < pharmacyName.length; i++) {
      const char = pharmacyName.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Use hash to generate consistent random-like offsets
    const random1 = (Math.abs(hash) % 1000) / 1000; // 0-1
    const random2 = (Math.abs(hash * 31) % 1000) / 1000; // 0-1

    // Generate coordinates within ~1km radius
    const latOffset = (random1 - 0.5) * 0.009; // ~0.009 degrees ≈ 1km
    const lngOffset = (random2 - 0.5) * 0.009;

    return {
      lat: ITI_LAT + latOffset,
      lng: ITI_LNG + lngOffset
    };
  }

  // Haversine formula for straight-line distance in km
  private haversineDistance(
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
  ): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLng = toRad(coord2.lng - coord1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coord1.lat)) *
        Math.cos(toRad(coord2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
