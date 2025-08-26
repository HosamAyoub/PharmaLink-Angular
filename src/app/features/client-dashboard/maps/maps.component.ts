import { Component, OnInit, signal } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { PharmacyService } from '../Pharmacies/Service/pharmacy-service';
import { Ipharmacy } from '../shared/models/ipharmacy';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css',
})
export class Maps implements OnInit {
  nearestPharmacies = signal<Ipharmacy[]>([]);
  constructor(private pharmacyService: PharmacyService) { }

  ngOnInit(): void {
    // this.getNearestPharmacies();
  }

  initializeMap(): void {
    let loader = new Loader({
      apiKey: '', // No API key needed for Haversine calculation
    });
    loader.load().then(() => {
      const mapElement = document.getElementById('map');

      if (mapElement) {
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
      } else {
        console.error("Map element with id 'map' not found.");
      }
    });
  }

  // getNearestPharmacies(){
  //   const position = { lat: 29.32353360394058, lng: 30.838584748642194 };
  //   this.pharmacyService.getNearestPharmacies(position.lat, position.lng).subscribe({
  //     next: (pharmacies) => {
  //       this.nearestPharmacies.set(pharmacies);
  //       console.log('Nearest pharmacies:', this.nearestPharmacies());
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
            title: pharmacy.name,
            label: markerIndex.toString(),
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // Pharmacy marker icon
              scaledSize: new google.maps.Size(32, 32)
            }
          });

          // Add pharmacy name label above the marker
          this.createPharmacyLabel(map, pharmacyPosition, pharmacy.name);

          const statusText = pharmacy.isOpen ? 'Open Now' : 'Closed';
          const statusColor = pharmacy.isOpen ? '#28a745' : '#dc3545';

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="max-width: 250px; font-family: Arial, sans-serif;">
                <h4 style="margin: 0 0 10px 0; color: #333;"><b>${pharmacy.name}</b></h4>
                <p style="margin: 5px 0;"><strong>Address:</strong> ${pharmacy.address}</p>
                ${pharmacy.phoneNumber ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${pharmacy.phoneNumber}</p>` : ''}
                ${pharmacy.rate ? `<p style="margin: 5px 0;"><strong>Rating:</strong> ${pharmacy.rate}/5 ⭐</p>` : ''}
                <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
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

  private getPharmacyCoordinates(pharmacy: Ipharmacy): { lat: number; lng: number } | null {
    // Check if pharmacy has valid latitude and longitude
    if (pharmacy.latitude && pharmacy.longitude) {
      return {
        lat: pharmacy.latitude,
        lng: pharmacy.longitude
      };
    }

    // If no coordinates are available, skip this pharmacy
    console.warn(`Pharmacy ${pharmacy.name} has no coordinate data`);
    return null;
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
