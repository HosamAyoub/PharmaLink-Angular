export const environment = {
  production: true,
  apiBaseUrl: 'https://pharma-link-apis.runasp.net/api', // MonsterASP backend
  apiHubsUrl: 'https://pharma-link-apis.runasp.net',
  apiVersion: 'v1',
  appName: 'PharmaLink',
  appUrl: 'https://pharma-link.runasp.net', // Frontend URL

  // IMPORTANT: Replace these with your actual production API keys
  // Do not commit real API keys to version control
  googleMapsApiKey: 'YOUR_PRODUCTION_GOOGLE_MAPS_API_KEY', // Replace with production Google Maps API key
  googleApiKey: 'YOUR_PRODUCTION_GOOGLE_API_KEY', // Replace with production Google API key
  geminiApiKey: 'YOUR_PRODUCTION_GEMINI_API_KEY', // Replace with production Gemini API key

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
