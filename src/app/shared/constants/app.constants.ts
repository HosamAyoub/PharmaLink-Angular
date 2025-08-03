export const APP_CONSTANTS = {
  API: {
    ENDPOINTS: {
      PRODUCTS: 'products',
      PHARMACIES: 'pharmacies',
      CATEGORIES: 'categories',
      PHARMACY: 'pharmacy',
      PHARMACY_STOCK_ALL: 'PharmacyStock/allPharmaciesStock',
      SEARCH: 'search',
      ACCOUNT_REGISTER: 'Account/Register',
      ACCOUNT_LOGIN: 'Account/Login',
      ACCOUNT_VERIFY_TOKEN: 'Account/VerifyToken',
      DRUG_CATEGORY: 'Drug/Category',
      DRUG_RANDOM: 'Drug/2',
      DRUG_BY_ID: 'Drug',
      FAVORITES: 'favorites',
      ORDERS_SUBMIT: 'Orders/submit',
      ORDERS_CREATE_CHECKOUT_SESSION: 'Orders/CreateCheckoutSession',
    },
  },
  environment: {
    production: true,
    apiBaseUrl: 'http://localhost:5278/api',
    apiVersion: 'v1',
    appName: 'PharmaLink',
    features: {
      enableNotifications: true,
      enableGeolocation: true,
      maxNearbyPharmacies: 10,
    },
  },
};
