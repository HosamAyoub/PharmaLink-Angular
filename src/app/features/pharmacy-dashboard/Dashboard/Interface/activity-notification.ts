import { DrugStatus } from "../../../../shared/enums/drug-status";

interface OrderNotification {
  orderID: number;
  status: string;
  message: string;
  timestamp: string;
}

interface DrugRequestNotification {
  drugID: number;
  commonName: string;
  drugStatus: DrugStatus;
  isRead: boolean;
  timestamp: string;
}


export interface ActivityNotification {
  orderNotifications: OrderNotification[];
  drugRequestNotifications: DrugRequestNotification[];
}

