
interface OrderNotification {
  orderID: number;
  status: string;
  message: string;
  timestamp: string;
}

interface DrugRequestNotification {
  drugID: number;
  commonName: string;
  drugStatus: number;
  isRead: boolean;
  timestamp: string;
}


export interface ActivityNotification {
  orderNotifications: OrderNotification[];
  drugRequestNotifications: DrugRequestNotification[];
}

