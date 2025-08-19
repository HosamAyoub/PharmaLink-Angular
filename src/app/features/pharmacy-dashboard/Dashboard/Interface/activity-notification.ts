import { DrugStatus } from "../../../../shared/enums/drug-status";

export interface OrderNotification {
  orderID: number;
  status: string;
  message: string;
  timestamp: string;
  type: string;
}

export interface DrugRequestNotification {
  drugID: number;
  commonName: string;
  drugStatus: DrugStatus;
  isRead: boolean;
  pharmacyName: string;
  timestamp: string
}

export interface PharmacyRegistrationNotification {
  pharmacyID: number;
  name: string;
  status: string;
  joinedDate: Date;
  address: string;
  phoneNumber: string;
}


export interface AdminNotification {
  drugRequests: DrugRequestNotification[];
  pharmaciesRequests: PharmacyRegistrationNotification[];
}

export interface ActivityNotification {
  orderNotifications: OrderNotification[];
  drugRequestNotifications: DrugRequestNotification[];
}

