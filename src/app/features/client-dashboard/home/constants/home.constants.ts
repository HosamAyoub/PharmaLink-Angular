export const HOME_CONSTANTS = {
  CAROUSEL: {
    AUTO_SLIDE_INTERVAL: 5000,
    ANIMATION_DURATION: 500,
    SLIDES_COUNT: 3,
    PAUSE_ON_HOVER: true
  },
  PRODUCTS: {
    FEATURED_COUNT: 4,
    CATEGORIES_COUNT: 4,
    DEFAULT_IMAGE: 'assets/images/icons/drug.svg',
    PRICE_CURRENCY: '$'
  },
  PHARMACIES: {
    NEARBY_COUNT: 3,
    DEFAULT_RADIUS: 5, // km
    RATING_MAX: 5,
    RATING_DECIMAL_PLACES: 1
  },
  SERVICES: {
    DISPLAY_COUNT: 3,
    ICONS: {
      MEDICINE: 'assets/images/icons/drug.svg',
      DELIVERY: 'assets/images/icons/delivery.svg',
      EXPERT: 'assets/images/icons/expert.svg'
    }
  },
  SEARCH: {
    PLACEHOLDER: 'Search medicines, pharmacies, or health products...',
    MIN_LENGTH: 2,
    DEBOUNCE_TIME: 300
  },
  UI: {
    CARD_HOVER_SCALE: 1.04,
    CARD_HOVER_TRANSLATE_Y: -8,
    ANIMATION_DURATION: 300,
    SECTION_PADDING: 64
  }
};
