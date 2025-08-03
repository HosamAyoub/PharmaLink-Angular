import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../../shared/services/config.service';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { HOME_CONSTANTS } from '../constants/home.constants';
import { IPharmacy, Category, SearchResponse, ApiResponse, UserLocation } from '../models/home.types';
import { IProduct } from '../../shared/models/IProduct';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  // Featured Products
  getFeaturedProducts(): Observable<any> {
    const url = this.configService.getFullApiUrl('PHARMACY_STOCK_ALL');
    const params = new HttpParams()
      .set('pageSize', HOME_CONSTANTS.PRODUCTS.FEATURED_COUNT.toString())
      .set('pageNumber', '1');

    return this.http.get<any>(url, { params });
  }

  // // Categories
  // getCategories(): Observable<Category[]> {
  //   const url = this.configService.getFullApiUrl('PHARMACY_STOCK');
  //   const params = new HttpParams().set('limit', HOME_CONSTANTS.PRODUCTS.CATEGORIES_COUNT.toString());
  //   return this.http.get<Category[]>(url, { params });
  // }

  // Nearby Pharmacies
  getNearbyPharmacies(latitude?: number, longitude?: number): Observable<IPharmacy[]> {
    const url = this.configService.getFullApiUrl('PHARMACY');
    let params = new HttpParams();
      // .set('limit', HOME_CONSTANTS.PHARMACIES.NEARBY_COUNT.toString())
      // .set('radius', HOME_CONSTANTS.PHARMACIES.DEFAULT_RADIUS.toString());

    if (latitude && longitude) {
      params = params.set('lat', latitude.toString()).set('lng', longitude.toString());
    }

    return this.http.get<IPharmacy[]>(url, { params });
  }

  // Search functionality
  searchProducts(query: string, page: number = 1): Observable<SearchResponse<IProduct>> {
    if (query.length < HOME_CONSTANTS.SEARCH.MIN_LENGTH) {
      throw new Error(`Search query must be at least ${HOME_CONSTANTS.SEARCH.MIN_LENGTH} characters long`);
    }

    const url = this.configService.getFullApiUrl('SEARCH');
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString());

    return this.http.get<SearchResponse<IProduct>>(url, { params });
  }

  // Get all products
  getAllProducts(page: number = 1): Observable<SearchResponse<IProduct>> {
    const url = this.configService.getFullApiUrl('PRODUCTS');
    const params = new HttpParams()
      .set('page', page.toString());

    return this.http.get<SearchResponse<IProduct>>(url, { params });
  }

  // Get all pharmacies
  getAllPharmacies(page: number = 1): Observable<SearchResponse<IPharmacy>> {
    const url = this.configService.getFullApiUrl('PHARMACIES');
    const params = new HttpParams()
      .set('page', page.toString());
    return this.http.get<SearchResponse<IPharmacy>>(url, { params });
  }

  getUserLocation(): Observable<UserLocation> {
    return new Observable<UserLocation>((observer) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            observer.complete();
          },
          (error) => {
            console.error('Geolocation error:', error);
            observer.error(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      } else {
        observer.error(new Error('Geolocation is not supported by this browser'));
      }
    });
  }

}
