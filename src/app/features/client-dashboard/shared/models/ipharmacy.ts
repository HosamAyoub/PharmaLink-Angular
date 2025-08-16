export interface Ipharmacy {
  pharmacyID: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  imgUrl?: string;
  rate?: number;
  startHour?: string;
  endHour?: string;
  isOpen: boolean;

}
