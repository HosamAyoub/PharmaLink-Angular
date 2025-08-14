import { Ipharmacy } from "../../../client-dashboard/shared/models/ipharmacy";

export interface PharmacyDisplayData extends Ipharmacy {
  license: string;
  totalOrders: number;
  totalRevenue: number;
  totalMedicineInStock: number;
}