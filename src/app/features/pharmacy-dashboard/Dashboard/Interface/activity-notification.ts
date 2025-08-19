import { DrugStatus } from "../../../../shared/enums/drug-status";

export interface OrderNotification {
  orderID: number;
  status: string;
  message: string;
  timestamp: string;
}

export interface DrugRequestNotification {
  drugID: number;
  commonName: string;
  drugStatus: DrugStatus;
  isRead: boolean;
  pharmacyName: string;
  timestamp: string;
}


export interface ActivityNotification {
  orderNotifications: OrderNotification[];
  drugRequestNotifications: DrugRequestNotification[];
}

