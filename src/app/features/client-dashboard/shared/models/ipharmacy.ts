export interface Ipharmacy {
  pharmacyID: number;
  name: string;
  ownerName?:string;
  email?: string;
  address: string;
  phoneNumber?: string;
  imgUrl?: string;
  docURL?: string;
  rate?: number;
  status: number;
  joinedDate:  Date;
  startHour?: string;
  endHour?: string;
}
