import {
  Component,
  OnInit,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  signal,
  inject,
  Input,
} from '@angular/core';
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
  styleUrl: './nearby-pharmacies.css',
})
export class NearbyPharmacies implements OnInit, AfterViewInit, OnChanges {
  nearestPharmacies = signal<IPharmaStock[]>([]);
  pharmacyProductDetialsService = inject(PharmacyProductDetialsService);
  @Input() selectedDrugId: number = 0;
  @Input() pharmacies: IPharmaStock[] = [];
  private mapInitialized = false;
  private userPosition: { lat: number; lng: number } | null = null;

  constructor(private pharmacyService: PharmacyService) {}

  ngOnInit(): void {
    console.log('NearbyPharmacies component initialized');
    console.log('Initial pharmacies input:', this.pharmacies);

    // Get user location from localStorage or use default
    this.getUserLocation();

    // Use input pharmacies data instead of fetching from service
    this.nearestPharmacies.set(this.pharmacies);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pharmacies']) {
      this.nearestPharmacies.set(this.pharmacies);

      // Initialize or re-initialize map with new data
      if (this.pharmacies && this.pharmacies.length > 0 && this.userPosition) {
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

    // Only initialize map if we have pharmacy data and user location
    if (this.pharmacies && this.pharmacies.length > 0 && this.userPosition) {
      setTimeout(() => {
        this.initializeMap();
      }, 100);
    } else {
      console.log(
        'No pharmacy data or location available yet, waiting for input changes...'
      );
    }
  }

  private getUserLocation(): void {
    try {
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        const position = JSON.parse(savedLocation);
        if (position.latitude && position.longitude) {
          this.userPosition = {
            lat: position.latitude,
            lng: position.longitude,
          };
          console.log('User location from localStorage:', this.userPosition);
        }
      }

      // If no saved location, use browser geolocation
      if (!this.userPosition && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            console.log('User location from geolocation:', this.userPosition);

            // Save to localStorage for future use
            localStorage.setItem(
              'userLocation',
              JSON.stringify({
                latitude: this.userPosition.lat,
                longitude: this.userPosition.lng,
              })
            );

            // Initialize map if we have pharmacy data
            if (this.pharmacies && this.pharmacies.length > 0) {
              this.initializeMap();
            }
          },
          (error) => {
            console.warn('Geolocation error, using default location:', error);
            // Use a default location if geolocation fails
            this.userPosition = {
              lat: 29.32353360394058,
              lng: 30.838584748642194,
            };
            this.initializeMap();
          }
        );
      } else if (!this.userPosition) {
        // Fallback to default location
        this.userPosition = { lat: 29.32353360394058, lng: 30.838584748642194 };
        console.log('Using default location:', this.userPosition);
      }
    } catch (error) {
      console.error('Error getting user location:', error);
      this.userPosition = { lat: 29.32353360394058, lng: 30.838584748642194 };
    }
  }

  initializeMap(): void {
    if (this.mapInitialized || !this.userPosition) {
      console.log('Map already initialized or no user location');
      return;
    }

    // Check if Google Maps is already loaded globally
    if (typeof google !== 'undefined' && google.maps) {
      console.log(
        'Google Maps already loaded globally, initializing directly...'
      );
      this.createMap();
      return;
    }

    // Use loader if Google Maps is not loaded
    let loader = new Loader({
      apiKey: environment.googleMapsApiKey,
      version: 'weekly',
    });

    loader
      .load()
      .then(() => {
        console.log('Google Maps loaded via Loader...');
        this.createMap();
      })
      .catch((error) => {
        console.error('Error loading Google Maps:', error);
        this.mapInitialized = false;
      });
  }

  private createMap(): void {
    const mapElement = document.getElementById('map');

    if (mapElement && this.userPosition) {
      console.log('Map element found, initializing map...');
      this.mapInitialized = true;

      // Set map container dimensions
      mapElement.style.height = '400px'; // Set specific height
      mapElement.style.width = '100%'; // Set specific width

      const map = new google.maps.Map(mapElement, {
        center: this.userPosition,
        zoom: 14, // Slightly lower zoom to see more area
        maxZoom: 18,
        // minZoom: 10, // Allow more zoom out to see distant pharmacies
        styles: [],
        disableDefaultUI: false,
        mapTypeControl: false,
        streetViewControl: false,
      });

      // Add 2km radius circle around user location (increased from 1km)
      const circle = new google.maps.Circle({
        strokeColor: '#2196F3',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#2196F3',
        fillOpacity: 0.1,
        map: map,
        center: this.userPosition,
        radius: 2000, // 2000 meters = 2km (increased radius)
      });

      // User location marker
      const marker = new google.maps.Marker({
        position: this.userPosition,
        map: map,
        title: 'Your Location',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new google.maps.Size(40, 40),
        },
      });

      // Add label for user marker
      this.createUserLabel(map, this.userPosition, 'Your Location');

      const userInfoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family: Arial, sans-serif;">
            <h4 style="margin: 0 0 5px 0; color: #333;"><b>Your Current Location</b></h4>
            <p style="margin: 0; color: #666; font-size: 12px;">
              Latitude: ${this.userPosition.lat.toFixed(6)}<br>
              Longitude: ${this.userPosition.lng.toFixed(6)}
            </p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        userInfoWindow.open(map, marker);
      });

      // Add markers for ALL pharmacies (not just within 2km)
      this.addPharmacyMarkers(map, this.userPosition);
      console.log('Map initialized successfully');

      // Trigger resize event to ensure map renders correctly
      setTimeout(() => {
        google.maps.event.trigger(map, 'resize');
        map.setCenter(this.userPosition!);
      }, 100);
    } else {
      console.error("Map element with id 'map' not found or no user location.");
    }
  }

  private addPharmacyMarkers(
    map: google.maps.Map,
    userPosition: { lat: number; lng: number }
  ): void {
    const pharmacies = this.nearestPharmacies();

    if (pharmacies.length === 0) {
      console.log('No pharmacies found to display on map');
      return;
    }

    let markerIndex = 1;
    let displayedCount = 0;

    pharmacies.forEach((pharmacy) => {
      const pharmacyPosition = this.getPharmacyCoordinates(pharmacy);

      if (pharmacyPosition) {
        const distance = this.haversineDistance(userPosition, pharmacyPosition);

        // Show ALL pharmacies regardless of distance, but use different styling
        const isNearby = distance <= 2.0; // Within 2km

        const marker = new google.maps.Marker({
          position: pharmacyPosition,
          map: map,
          title: `${pharmacy.pharma_Name} (${distance.toFixed(2)} km away)`,
          label: markerIndex.toString(),
          icon: {
            url: isNearby
              ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' // Nearby: green
              : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // Far: red
            scaledSize: new google.maps.Size(32, 32),
          },
        });

        // Add pharmacy name label above the marker
        this.createPharmacyLabel(
          map,
          pharmacyPosition,
          pharmacy.pharma_Name,
          isNearby
        );

        const statusText =
          pharmacy.quantityAvailable > 0 ? 'In Stock' : 'Out of Stock';
        const statusColor =
          pharmacy.quantityAvailable > 0 ? '#28a745' : '#dc3545';

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="max-width: 250px; font-family: Arial, sans-serif;">
              <h4 style="margin: 0 0 10px 0; color: #333;"><b>${
                pharmacy.pharma_Name
              }</b></h4>
              <p style="margin: 5px 0;"><strong>Address:</strong> ${
                pharmacy.pharma_Address
              }</p>
              ${
                pharmacy.price > 0
                  ? `<p style="margin: 5px 0;"><strong>Price:</strong> $${pharmacy.price}</p>`
                  : ''
              }
              <p style="margin: 5px 0;"><strong>Distance:</strong> ${distance.toFixed(
                2
              )} km from you</p>
              <p style="margin: 5px 0; color: ${
                isNearby ? '#28a745' : '#ff9800'
              }; font-weight: bold;">
          ${isNearby ? '📍 Nearby (within 2km)' : '🚗 Further away'}
              </p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        markerIndex++;
        displayedCount++;
      }
    });

    console.log(`Displayed ${displayedCount} pharmacies on map`);
  }

  private createPharmacyLabel(
    map: google.maps.Map,
    position: { lat: number; lng: number },
    name: string,
    isNearby: boolean
  ): void {
    const labelDiv = document.createElement('div');
    labelDiv.style.cssText = `
      position: absolute;
      background: ${
        isNearby ? 'rgba(76, 175, 80, 0.95)' : 'rgba(244, 67, 54, 0.95)'
      };
      border: 1px solid ${isNearby ? '#4CAF50' : '#F44336'};
      border-radius: 6px;
      padding: 4px 8px;
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 11px;
      font-weight: 600;
      color: white;
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

    const displayName = name.length > 15 ? name.substring(0, 12) + '...' : name;
    labelDiv.textContent = displayName;

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

    const label = new CustomLabel(
      new google.maps.LatLng(position.lat, position.lng),
      labelDiv
    );
    label.setMap(map);
  }

  private createUserLabel(
    map: google.maps.Map,
    position: { lat: number; lng: number },
    name: string
  ): void {
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

    const label = new CustomLabel(
      new google.maps.LatLng(position.lat, position.lng),
      labelDiv
    );
    label.setMap(map);
  }

  private getPharmacyCoordinates(
    pharmacy: IPharmaStock
  ): { lat: number; lng: number } | null {
    // Check if pharmacy has actual coordinates (modify this based on your actual data structure)
    if (pharmacy.pharma_Latitude && pharmacy.pharma_Longitude) {
      return {
        lat: pharmacy.pharma_Latitude,
        lng: pharmacy.pharma_Longitude,
      };
    }

    // Fallback to mock coordinates if no real coordinates available
    return this.generateMockCoordinates(pharmacy.pharma_Name);
  }

  private generateMockCoordinates(pharmacyName: string): {
    lat: number;
    lng: number;
  } {
    // Use user location as center if available, otherwise use default
    const centerLat = this.userPosition?.lat || 29.323379349390862;
    const centerLng = this.userPosition?.lng || 30.838273256448545;

    // Create hash for consistent positioning
    let hash = 0;
    for (let i = 0; i < pharmacyName.length; i++) {
      const char = pharmacyName.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    const random1 = (Math.abs(hash) % 1000) / 1000;
    const random2 = (Math.abs(hash * 31) % 1000) / 1000;

    // Generate coordinates within ~5km radius (increased for distant pharmacies)
    const latOffset = (random1 - 0.5) * 0.045; // ~0.045 degrees ≈ 5km
    const lngOffset = (random2 - 0.5) * 0.045;

    return {
      lat: centerLat + latOffset,
      lng: centerLng + lngOffset,
    };
  }

  private haversineDistance(
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
  ): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
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
