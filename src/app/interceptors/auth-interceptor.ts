import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImI2ZjAxNzFmLWM5NWQtNDBiYi04OTk2LWQzMTRhY2Q5ZTRkMCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6Ik1hcmllbUBleGFtcGxlLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJNYXJpZW0iLCJqdGkiOiJlOWY3ODVjYS01MjIyLTQ2MzUtYjU5Ny0wMWFkNGU4Yjk0M2UiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNzUzNTQ5Nzc1LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUyNzgvIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo0MjAwLyJ9.rizi3BZS9Vrnb9EtN5N1rgkL0Ou9xr9rCVcJ9g3WjJQ'; 

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  return next(req);
};
