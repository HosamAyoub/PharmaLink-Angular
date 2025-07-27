export interface SubmitOrderRequest {
    items: {
    drugId: number;
    pharmacyId: number;
    quantity: number;
  }[];
}
