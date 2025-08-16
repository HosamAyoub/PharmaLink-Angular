export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5278/api',
  apiVersion: 'v1',
  appName: 'PharmaLink',
  googleMapsApiKey: 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY', // Demo API key - replace with your own
  features: {
    enableNotifications: true,
    enableGeolocation: true,
    maxNearbyPharmacies: 10,
  },
  ui: {
    itemsPerPage: 12,
    carouselInterval: 5000,
    animationDuration: 300,
  },
};
