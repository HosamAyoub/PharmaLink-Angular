export interface IPharmacyAnalysis {
    totalRevenue:         number;
    totalOrders:          number;
    totalUniqueCustomers: number;
    monthlyStats:         MonthlyStat[];
    topSellingProducts:   TopSellingProduct[];
    topCustomers:         TopCustomer[];
}

export interface MonthlyStat {
    monthYear:    string;
    orderCount:   number;
    totalRevenue: number;
}

export interface TopCustomer {
    customerId:   number;
    customerName: string;
    totalOrders:  number;
    totalSpent:   number;
}

export interface TopSellingProduct {
    drugId:        number;
    drugName:      string;
    totalQuantity: number;
    totalRevenue:  number;
}
export interface IPharmacystockAnalysis {
    inStockCount:    number;
    outOfStockCount: number;
    lowStockCount:   number;
    totalCount:      number;
}