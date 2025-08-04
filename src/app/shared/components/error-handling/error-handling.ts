import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

interface BackendErrorResponse {
  success: boolean;
  message: string;
  errors?: string[] | null;
}

@Component({
  selector: 'app-error-handling',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-handling.html',
  styleUrls: ['./error-handling.css']
})
export class ErrorHandling implements OnInit {
  @Input() errorCode: string = '404';
  @Input() errorTitle: string = 'Oops! Page Not Found';
  @Input() errorMessage: string = "The page you're looking for doesn't exist or was moved.";
  @Input() showContactSupport: boolean = true;
  @Input() httpError?: HttpErrorResponse;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.httpError) {
      this.handleHttpError(this.httpError);
    }
  }

  private handleHttpError(error: HttpErrorResponse): void {
    const backendResponse = error.error as BackendErrorResponse;

    switch (error.status) {
      case 400: // BadRequest - Validation or BusinessRule errors
        this.errorCode = '400';
        this.errorTitle = 'Invalid Request';
        this.errorMessage = backendResponse?.message || 'The request contains invalid data. Please check your input and try again.';
        if (backendResponse?.errors && backendResponse.errors.length > 0) {
          this.errorMessage += '\n\nValidation errors:\n• ' + backendResponse.errors.join('\n• ');
        }
        this.showContactSupport = false;
        break;

      case 401: // Unauthorized
        this.errorCode = '401';
        this.errorTitle = 'Authentication Required';
        this.errorMessage = 'Please log in to access this resource.';
        this.showContactSupport = false;
        break;

      case 403: // Forbidden - Authorization error
        this.errorCode = '403';
        this.errorTitle = 'Access Denied';
        this.errorMessage = 'You don\'t have permission to access this resource.';
        this.showContactSupport = false;
        break;

      case 404: // NotFound
        this.errorCode = '404';
        this.errorTitle = 'Not Found';
        this.errorMessage = backendResponse?.message || 'The requested resource was not found.';
        this.showContactSupport = false;
        break;

      case 409: // Conflict
        this.errorCode = '409';
        this.errorTitle = 'Conflict';
        this.errorMessage = backendResponse?.message || 'There was a conflict with the current state of the resource.';
        this.showContactSupport = false;
        break;

      case 500: // Internal Server Error
        this.errorCode = '500';
        this.errorTitle = 'Internal Server Error';
        this.errorMessage = 'Something went wrong on our end. Please try again later.';
        this.showContactSupport = true;
        break;

      case 503: 
        this.errorCode = '503';
        this.errorTitle = 'Service Unavailable';
        this.errorMessage = 'Our services are temporarily unavailable. Please try again in a few minutes.';
        this.showContactSupport = true;
        break;

      default:
        this.errorCode = error.status.toString();
        this.errorTitle = 'Unexpected Error';
        this.errorMessage = backendResponse?.message || 'An unexpected error occurred. Please try again.';
        this.showContactSupport = true;
        break;
    }
  }

  // Static method to create error handling component with HTTP error
  static createFromHttpError(httpError: HttpErrorResponse): any {
    return {
      httpError: httpError,
      errorCode: httpError.status.toString(),
      errorTitle: 'Error',
      errorMessage: 'An error occurred',
      showContactSupport: true
    };
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  contactSupport(): void {
    // Navigate to contact page or open email/chat
    console.log('Contact support clicked');
    // You can implement your contact logic here
    // this.router.navigate(['/contact']);
  }

  goBack(): void {
    window.history.back();
  }
}
