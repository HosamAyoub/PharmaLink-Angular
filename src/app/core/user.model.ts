export class User {
  constructor(
    private _token: string,
    private _expiration: Date,
    public userName: string
  ) {}

  get token() {
    if (!this._expiration || new Date() > this._expiration) {
      return null;
    }
    return this._token;
  }
}

export interface ResponseData {
  value: {
    token: 'string';
    expiration: 'string';
    userName: 'string';
  };
  statusCode: 200;
}
