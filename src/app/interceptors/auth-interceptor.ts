import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6Ijg3NDVmYWQyLWVmOWYtNGI2NS05NDRlLWJlOTU2ZjY4MmQyMCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6Ikhvc3NhbUBleGFtcGxlLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJIb3NzYW0iLCJqdGkiOiI0M2VkNjc3OC1jOGM2LTRmYWEtYjM0YS0xMDU0NmYzYTAyYWQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJQYXRpZW50IiwiZXhwIjoxNzUzNjU4NjkwLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUyNzgvIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo0MjAwLyJ9.ZfWjJw7-H9YeGxCzqzGnklMYGzqkg8NjVjuOZsqeqDc'; 

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
