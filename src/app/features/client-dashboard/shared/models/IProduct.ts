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
