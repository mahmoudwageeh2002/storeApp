export const API_BASE_URL = 'https://dummyjson.com';

export const ROUTES = {
  LOGIN: 'Login',
  ALL_PRODUCTS: 'AllProducts',
  CATEGORY: 'Category',
} as const;

export const CATEGORIES = [
  'beauty',
  'fragrances',
  'furniture',
  'groceries',
  'home-decoration',
  'kitchen-accessories',
  'laptops',
  'mens-shirts',
  'mens-shoes',
  'mens-watches',
  'mobile-accessories',
  'motorcycle',
  'skin-care',
  'smartphones',
  'sports-accessories',
  'sunglasses',
  'tablets',
  'tops',
  'vehicle',
  'womens-bags',
  'womens-dresses',
  'womens-jewellery',
  'womens-shoes',
  'womens-watches',
] as const;

export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  IS_AUTHENTICATED: 'is_authenticated',
  APP_LOCK_ENABLED: 'app_lock_enabled',
  THEME_MODE: 'theme_mode',
} as const;
