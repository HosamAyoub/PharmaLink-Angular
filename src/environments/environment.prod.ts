export const environment = {
  production: true,
  apiBaseUrl: 'https://pharma-link-apis.runasp.net/api', // MonsterASP backend
  apiHubsUrl: 'https://pharma-link-apis.runasp.net',
  apiVersion: 'v1',
  appName: 'PharmaLink',
  appUrl: 'https://pharma-link.runasp.net', // Frontend URL

  // API Keys - Should be replaced with actual production keys
  googleMapsApiKey: 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY', // Replace with production Google Maps API key
  googleApiKey: 'AIzaSyCsSmpYJNb9htQSnH1NM-yHmM4bOSzZnUU', // Replace with production Google API key
  geminiApiKey: 'AIzaSyBSXPpqjr1-2tlAqZmVSMYCDdL2Gb7SgxM', // Updated Gemini API key

  // External API URLs
  geminiApiUrl:
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',
  geminiApiUrlFlash:
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  geminiApiUrlFlashLite:
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',

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
