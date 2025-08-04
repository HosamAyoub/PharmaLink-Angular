export const APP_CONSTANTS = {
  API: {
    ENDPOINTS: {
      PRODUCTS: 'products',
      PHARMACIES: 'pharmacies',
      CATEGORIES: 'categories',
      PHARMACY_STOCK_ALL: 'PharmacyStock/allPharmaciesStock',
      BATCH_PHARMACY_STOCK_BY_ID: 'PharmacyStock/GetBatchOfPharmacyStock',
      PHARMACYSTOCK_INVENTORY_STATUS_BY_ID: 'PharmacyStock/InventoryStatusByID',
      PHARMACYSTOCK_SEARCH_ALL: 'PharmacyStock/SearchFor',
      SEARCH: 'search',
<<<<<<< Updated upstream
=======
      ACCOUNT_REGISTER: 'Account/Register',
      ACCOUNT_LOGIN: 'Account/Login',
      DRUG_CATEGORY: 'Drug/Category',
      DRUG_RANDOM: 'Drug/2',
      DRUG_BY_ID: 'Drug',
      DRUG_SEARCH: 'Drug/Search',
      FAVORITES: 'favorites',
      ORDERS_SUBMIT: 'Orders/submit',
      ORDERS_CREATE_CHECKOUT_SESSION: 'Orders/CreateCheckoutSession',
>>>>>>> Stashed changes
    },
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
  },
  UI: {
    ITEMS_PER_PAGE: 10,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    DEBOUNCE_TIME: 300, // ms
    ANIMATION_DURATION: 300, // ms
  },
  ROUTES: {
    HOME: '/',
    PRODUCTS: '/products',
    PHARMACIES: '/pharmacies',
    CATEGORIES: '/categories',
    CART: '/cart',
    PROFILE: '/profile',
  },
  STORAGE_KEYS: {
    USER_PREFERENCES: 'user_preferences',
    CART_ITEMS: 'cart_items',
    FAVORITES: 'favorites',
    RECENT_SEARCHES: 'recent_searches',
  },
  VALIDATION: {
    MIN_SEARCH_LENGTH: 2,
    MAX_SEARCH_LENGTH: 100,
    PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
};
