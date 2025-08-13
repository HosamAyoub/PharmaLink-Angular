export interface Ipharmacy {
  pharmacyID: number;
  name: string;
  address: string;
  phoneNumber?: string;
  imgUrl?: string;
  rate?: number;
  status: number;
  joinedDate:  Date;
  startHour?: string;
  endHour?: string;
}
