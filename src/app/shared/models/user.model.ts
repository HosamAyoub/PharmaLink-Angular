export class User {
  constructor(
    private _token: string,
    private _expiration: string,
    public userName: string
  ) {}

  get token() {
    if (!this._expiration || new Date() > new Date(this._expiration)) {
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
  patientDiseases?: string;
  patientDrugs?: string;
}
