export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5278/api',
  apiVersion: 'v1',
  appName: 'PharmaLink',
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
  GEMINI_API_KEY: 'AIzaSyCTmMYS8l_bl_H4G0FWTTkkWA-Jw_gLvEU',
};
