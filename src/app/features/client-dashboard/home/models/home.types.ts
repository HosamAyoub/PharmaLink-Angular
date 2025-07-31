// Product related types
export interface IProduct {
  drugId: number;
  drugName: string;
  price: string;
  quantityAvailable: number;
  drugImageUrl: string;
  drugDescription?: string;
  inStock?: boolean;
  pharmacyId: number;
  pharmacyName: string;
}

// Pharmacy related types
export interface IPharmacy {
  name: string;
  address: string;
  rate: number;
  startHour: string;
  endHour: string;
  isOpen: boolean;

}

// Category related types
export interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
  productCount?: number;
}

// Search response type
export interface SearchResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Location interface for geolocation
export interface UserLocation {
  latitude: number;
  longitude: number;
}
