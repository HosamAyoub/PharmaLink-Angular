import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  apiUrl: any;

  // Environment getters
  get apiBaseUrl(): string {
    return APP_CONSTANTS.environment.apiBaseUrl;
  }

  get apiVersion(): string {
    return APP_CONSTANTS.environment.apiVersion;
  }

  get appName(): string {
    return APP_CONSTANTS.environment.appName;
  }

  get isProduction(): boolean {
    return APP_CONSTANTS.environment.production;
  }


  // API URL builders
  getApiUrl(endpoint: string): string {
    return `${this.apiBaseUrl}/${endpoint}`;
  }

  // Hub URL builders
  getHubUrl(hub: string): string {
    const apiHubsUrl = APP_CONSTANTS.environment.apiHubsUrl;
    return `${apiHubsUrl}/${hub}`;
  }

  getFullApiUrl(endpoint: string): string {
    const apiEndpoint = APP_CONSTANTS.API.ENDPOINTS[endpoint as keyof typeof APP_CONSTANTS.API.ENDPOINTS];
    return this.getApiUrl(apiEndpoint || endpoint);
  }


}
