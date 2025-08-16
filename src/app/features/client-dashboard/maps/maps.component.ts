import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css',
})
export class Maps implements OnInit {
  ngOnInit(): void {
    let loader = new Loader({
      apiKey: '', // No API key needed for Haversine calculation
    });
    loader.load().then(() => {
      const mapElement = document.getElementById('map');
      
      if (mapElement) {
        const position = { lat: 29.323379349390862, lng: 30.838273256448545 };
        const dest1 = { lat: 29.325, lng: 30.84 };
        const dest2 = { lat: 29.33, lng: 30.85 };

        const map = new google.maps.Map(mapElement, {
          center: position,
          zoom: 14,
          styles: [],
        });

        // Main marker
        const marker = new google.maps.Marker({
          position: position,
          map: map,
          title: 'معهد تكنولوجيا المعلومات ITI - Fayoum Branch',
        });

        const mainInfoWindow = new google.maps.InfoWindow({
          content: `<b>معهد تكنولوجيا المعلومات ITI - Fayoum Branch</b>`,
        });

        marker.addListener('click', () => {
          mainInfoWindow.open(map, marker);
        });

        // City Pharmacy marker and info window
        const marker1 = new google.maps.Marker({
          position: dest1,
          map: map,
          title: 'City Pharmacy',
          label: '1',
        });
        const infoWindow1 = new google.maps.InfoWindow({
          content: `<b>City Pharmacy</b><br>
            Distance from main: ${this.haversineDistance(
              position,
              dest1
            ).toFixed(2)} km`,
        });
        marker1.addListener('click', () => {
          infoWindow1.open(map, marker1);
        });

        // Fayoum Pharmacy marker and info window
        const marker2 = new google.maps.Marker({
          position: dest2,
          map: map,
          title: 'Fayoum Pharmacy',
          label: '2',
        });
        const infoWindow2 = new google.maps.InfoWindow({
          content: `<b>Fayoum Pharmacy</b><br>
            Distance from main: ${this.haversineDistance(
              position,
              dest2
            ).toFixed(2)} km`,
        });
        marker2.addListener('click', () => {
          infoWindow2.open(map, marker2);
        });
      } else {
        console.error("Map element with id 'map' not found.");
      }
    });
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
