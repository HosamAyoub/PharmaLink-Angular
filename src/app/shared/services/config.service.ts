import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  // Environment getters
  get apiBaseUrl(): string {
    return environment.apiBaseUrl;
  }

  get apiVersion(): string {
    return environment.apiVersion;
  }

  get appName(): string {
    return environment.appName;
  }

  get isProduction(): boolean {
    return environment.production;
  }


  // API URL builders
  getApiUrl(endpoint: string): string {
    return `${this.apiBaseUrl}/${endpoint}`;
  }

  getFullApiUrl(endpoint: string): string {
    const apiEndpoint = APP_CONSTANTS.API.ENDPOINTS[endpoint as keyof typeof APP_CONSTANTS.API.ENDPOINTS];
    return this.getApiUrl(apiEndpoint || endpoint);
  }

  // Timeout configurations
  get apiTimeout(): number {
    return APP_CONSTANTS.API.TIMEOUT;
  }

  get retryAttempts(): number {
    return APP_CONSTANTS.API.RETRY_ATTEMPTS;
  }
}
