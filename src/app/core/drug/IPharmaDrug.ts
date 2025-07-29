import { IDrug } from "./IDrug"

export interface IPharmaDrug
{
    drug_Info:IDrug,
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

