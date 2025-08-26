export interface IUsersDisplay {
    patientId:   number;
    userId:      string;
    userName:    string;
    name:        string;
    gender:      number;
    dateOfBirth: Date;
    country:     string;
    address:     string;
    phoneNumber: string;
    email:       string;
    orderCount:  number;
    status?:     number;
}

