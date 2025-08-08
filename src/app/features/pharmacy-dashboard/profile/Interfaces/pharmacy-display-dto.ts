export interface PharmacyDisplayDTO {
    pharmacyID: number;
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
    imgUrl?: string;
    rate?: number;
    startHour?: string; 
    endHour?: string;
}
