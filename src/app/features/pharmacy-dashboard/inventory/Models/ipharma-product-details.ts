import { ProductStatus } from "../../../../shared/enums/product-status-enum"
export interface IPharmaProductDetails {
    drugId: number,
    drugName: string,
    drugCategory: string,
    drugActiveIngredient: string,
    drugDescription: string,
    drugImageUrl: string,
    pharmacyId: number,
    pharmacyName: string,
    price: number,
    quantityAvailable: number,
    status: ProductStatus
}
