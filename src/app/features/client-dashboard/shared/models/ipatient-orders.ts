export interface IPatientOrders {
    orderId: number;
    pharmacyName: string;
    pharmacyAddress: string;
    pharmacyPhoneNumber: string;
    orderDate: string; 
    status: string;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    deliveryAddress: string;
    orderDetails: orderDetails[];
}

export interface orderDetails{
    drugName: string;
    drugId: number;
    quantity: number;
}
