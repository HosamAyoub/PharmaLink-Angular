export interface AdminAnalysisInterface {
    allrevenue:      number;
    allDrugStock:    number;
    pharmacySummary: PharmacySummary[];
}

export interface PharmacySummary {
    pharmacyID:           number;
    name:                 string;
    rate:                 number | null;
    totalOrders:          number;
    totalRevenue:         number;
    totalMedicineInStock: number;
}

