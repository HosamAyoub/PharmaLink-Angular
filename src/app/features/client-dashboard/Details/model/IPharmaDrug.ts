import { IDrug } from "../../Categories_Page/models/IDrug"
import { IDrugDetails } from "./IDrugDetials"

export interface IPharmaDrug
{
    drug_Info:IDrugDetails,
    pharma_Info :IPharmaStock[]
}

export interface IPharmaStock
{
    pharma_Id: number,
    pharma_Name: string,
    pharma_Latitude: number,
    pharma_Longitude: number,
    pharma_Address: string,
    price: number,
    quantityAvailable: number,
    distance: number
}

