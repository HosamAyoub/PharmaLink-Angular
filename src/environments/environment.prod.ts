export const environment = {
  production: true,
  apiBaseUrl: 'https://pharma-link-apis.runasp.net/api', // MonsterASP backend
  apiVersion: 'v1',
  appName: 'PharmaLink',
  appUrl: 'https://pharma-link.runasp.net', // Added your frontend URL
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
