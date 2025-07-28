export interface CartItem {
    drugId: number;
    pharmacyId: number;
    drugName: string;
    pharmacyName: string;
    imageUrl: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
}
