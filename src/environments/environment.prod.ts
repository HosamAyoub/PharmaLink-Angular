export const environment = {
  production: true,
  apiBaseUrl: 'https://api.pharmalink.com/api',
  apiVersion: 'v1',
  appName: 'PharmaLink',
  features: {
    enableNotifications: true,
    enableGeolocation: true,
    maxNearbyPharmacies: 10
  },
  ui: {
    itemsPerPage: 12,
    carouselInterval: 5000,
    animationDuration: 300
  }
};
