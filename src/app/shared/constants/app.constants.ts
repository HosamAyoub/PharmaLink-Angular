export const APP_CONSTANTS = {
  API: {
    ENDPOINTS: {
      PRODUCTS: '/products',
      PHARMACIES: 'pharmacies',
      CATEGORIES: 'categories',
      PHARMACY_STOCK_ALL: 'PharmacyStock/all',
      SEARCH: 'search'
    },
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3
  },
  UI: {
    ITEMS_PER_PAGE: 10,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    DEBOUNCE_TIME: 300, // ms
    ANIMATION_DURATION: 300 // ms
  },
  ROUTES: {
    HOME: '/',
    PRODUCTS: '/products',
    PHARMACIES: '/pharmacies',
    CATEGORIES: '/categories',
    CART: '/cart',
    PROFILE: '/profile'
  },
  STORAGE_KEYS: {
    USER_PREFERENCES: 'user_preferences',
    CART_ITEMS: 'cart_items',
    FAVORITES: 'favorites',
    RECENT_SEARCHES: 'recent_searches'
  },
  VALIDATION: {
    MIN_SEARCH_LENGTH: 2,
    MAX_SEARCH_LENGTH: 100,
    PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};
