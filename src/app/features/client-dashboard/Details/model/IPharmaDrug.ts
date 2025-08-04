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
    pharma_Location: string,
    pharma_Address: string,
    price: number,
    quantityAvailable: number
}

