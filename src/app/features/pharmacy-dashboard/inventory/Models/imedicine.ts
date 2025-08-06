import { IPharmaProduct } from "./ipharma-product";

export interface IMedicine {
    pharmaproduct: IPharmaProduct;
    isediting: boolean;
    available: boolean;
}
