import { IOrderDetail } from "./iorder-detail";

export interface IOrder {
    orderID: number;
    orderDate: string;
    status: string;
    totalPrice: number;
    paymentStatus: string;
    orderDetails: IOrderDetail[];
    name: string;
    phoneNumber: string;
}
