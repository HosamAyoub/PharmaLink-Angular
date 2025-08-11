import { ProductStatus } from "./product-status-enum";
export interface IPharmacyproduct {
    drugId: number;
    price: number;
    quantityAvailable: number;
    status: ProductStatus;
}

