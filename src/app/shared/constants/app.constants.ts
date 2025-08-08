export const APP_CONSTANTS = {
  API: {
    ENDPOINTS: {
      PRODUCTS: 'products',
      PHARMACIES: 'pharmacies',
      CATEGORIES: 'categories',
      PHARMACY: 'pharmacy',
      PHARMACY_STOCK: 'PharmacyStock',
      PHARMACY_STOCK_ALL: 'PharmacyStock/allPharmaciesStock',
      BATCH_PHARMACY_STOCK_BY_ID: 'PharmacyStock/GetBatchOfPharmacyStock',
      PHARMACYSTOCK_INVENTORY_STATUS_BY_ID: 'PharmacyStock/InventoryStatusByID',
      PHARMACYSTOCK_SEARCH_ALL: 'PharmacyStock/SearchFor',
      SEARCH: 'search',
      ACCOUNT_REGISTER: 'Account/Register',
      ACCOUNT_LOGIN: 'Account/Login',
      ACCOUNT_VERIFY_TOKEN: 'Account/VerifyToken',
      DRUG_CATEGORY: 'Drug/Category',
      DRUG_RANDOM: 'Drug/2',
      DRUG_BY_ID: 'Drug',
      DRUG_SEARCH: 'Drug/Search',
      FAVORITES: 'favorites',
      ORDERS_SUBMIT: 'Orders/submit',
      ORDER_SUMMARY: 'Orders/order-summary',
      ORDERS_CREATE_CHECKOUT_SESSION: 'Orders/CreateCheckoutSession',
      PATIENT_PROFILE: 'Patient/Profile',
      PATIENT_PROFILE_EDIT: 'Patient/UpdateProfile',
      PHARMACY_ANALYSIS: 'Orders/analysis',
      PHARMACY_STOCK_ANALYSIS: 'PharmacyStock/InventoryStatusByID',
      ORDERS_VALIDATE_SESSION: 'orders/validate-session',
    },
  },
  environment: {
    production: true,
    apiBaseUrl: 'http://localhost:5278/api',
    apiVersion: 'v1',
    appName: 'PharmaLink',
    googleApiKey: 'AIzaSyCsSmpYJNb9htQSnH1NM-yHmM4bOSzZnUU',
    features: {
      enableNotifications: true,
      enableGeolocation: true,
      maxNearbyPharmacies: 10,
    },
  },

  ErrorCodes:{
    DIFFERENT_PHARMACY : 'DIFFERENT_PHARMACY',
  },
  Cart: 'Cart'
};
