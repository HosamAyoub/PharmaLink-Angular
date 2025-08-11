export class User {
  constructor(
    private _token: string,
    private _expiration: string,
    public userName: string,
    public role: Roles
  ) {}

  get token() {
    if (
      !this._expiration ||
      new Date().getTime() > new Date(this._expiration).getTime()
    ) {
      return null;
    }
    return this._token;
  }
}

export interface ResponseData {
  value: {
    token: string;
    expiration: string;
    userName: string;
    role: Roles;
  };
  statusCode: number;
}

export interface SignUpData {
  userName: string;
  email: string;
  passwordHash: string;
  confirmPassword: string;
  phoneNumber: string;
  patient: Patient;
}

export interface Patient {
  name: string;
  gender: number;
  dateOfBirth: Date;
  country: string;
  address?: string;
  medicalHistory?: string;
  medications?: string;
  allergies?: string;
}

export enum Roles {
  Admin = 'Admin',
  Pharmacy = 'Pharmacy',
  Patient = 'Patient',
}
