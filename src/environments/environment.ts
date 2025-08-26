export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5278/api',
  apiHubsUrl: 'http://localhost:5278',
  apiVersion: 'v1',
  appName: 'PharmaLink',
  appUrl: 'http://localhost:4200',

  // API Keys - Use environment variables in production
  googleMapsApiKey: 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY', // Demo API key - replace with your own
  googleApiKey: 'AIzaSyCsSmpYJNb9htQSnH1NM-yHmM4bOSzZnUU', // Demo API key - replace with your own
  geminiApiKey: 'AIzaSyA8DdlgPt0JoXz-n-P26Ec5SYbJLeEMtBw', // Updated Gemini API key for new CSV data

  // External API URLs
  geminiApiUrl:
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',

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
