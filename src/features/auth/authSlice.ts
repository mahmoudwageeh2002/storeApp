import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mmkvStorage } from '../../storage/mmkv';
import { STORAGE_KEYS } from '../../utils/constants';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  gender?: string;
  image?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Helper function to safely get from storage
const getStorageItem = (key: string): string | null => {
  try {
    return mmkvStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return null;
  }
};

// Helper function to safely parse JSON from storage
const parseStorageJSON = <T>(key: string): T | null => {
  try {
    const item = getStorageItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error parsing ${key} from storage:`, error);
    return null;
  }
};

const initialState: AuthState = {
  isAuthenticated: getStorageItem(STORAGE_KEYS.IS_AUTHENTICATED) === 'true',
  token: getStorageItem(STORAGE_KEYS.USER_TOKEN),
  refreshToken: getStorageItem('refresh_token'),
  user: parseStorageJSON<User>(STORAGE_KEYS.USER_DATA),
  loading: false,
  error: null,
};

// Log initial state for debugging
console.log('Auth initial state:', {
  isAuthenticated: initialState.isAuthenticated,
  hasToken: !!initialState.token,
  hasUser: !!initialState.user,
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: state => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken?: string;
        user: User;
      }>,
    ) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.user = action.payload.user;
      state.loading = false;
      state.error = null;

      // Persist to storage with error handling
      try {
        mmkvStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');
        mmkvStorage.setItem(STORAGE_KEYS.USER_TOKEN, action.payload.token);
        if (action.payload.refreshToken) {
          mmkvStorage.setItem('refresh_token', action.payload.refreshToken);
        }
        mmkvStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(action.payload.user),
        );
        console.log('Auth data saved to storage successfully');
      } catch (error) {
        console.error('Error saving auth data to storage:', error);
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.loading = false;
      state.error = action.payload;

      // Clear storage
      try {
        mmkvStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
        mmkvStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
        mmkvStorage.removeItem('refresh_token');
        mmkvStorage.removeItem(STORAGE_KEYS.USER_DATA);
      } catch (error) {
        console.error('Error clearing auth data from storage:', error);
      }
    },
    logout: state => {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.loading = false;
      state.error = null;

      // Clear storage
      try {
        mmkvStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
        mmkvStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
        mmkvStorage.removeItem('refresh_token');
        mmkvStorage.removeItem(STORAGE_KEYS.USER_DATA);
        console.log('Auth data cleared from storage');
      } catch (error) {
        console.error('Error clearing auth data from storage:', error);
      }
    },
    clearError: state => {
      state.error = null;
    },
    fetchProfileStart: state => {
      state.loading = true;
      state.error = null;
    },
    fetchProfileSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;

      // Update user data in storage
      try {
        mmkvStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(action.payload),
        );
      } catch (error) {
        console.error('Error updating user data in storage:', error);
      }
    },
    fetchProfileFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
} = authSlice.actions;
export default authSlice.reducer;
