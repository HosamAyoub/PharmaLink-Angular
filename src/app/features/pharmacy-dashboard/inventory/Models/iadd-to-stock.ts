import { IDrugDetails } from "../../../client-dashboard/Details/model/IDrugDetials";


export interface IAddToStock {

  drugdetails : IDrugDetails;
  quantity: number;
  price: number;
}
