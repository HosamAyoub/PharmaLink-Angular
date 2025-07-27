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
    price: number,
    quantityAvailable: number
} 

