import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import lockReducer from '../features/lock/lockSlice';
import { mmkvStorage } from '../storage/mmkv';

// Custom storage adapter for redux-persist to use MMKV
const storage = {
  setItem: (key: string, value: string) => {
    return Promise.resolve(mmkvStorage.setItem(key, value));
  },
  getItem: (key: string) => {
    return Promise.resolve(mmkvStorage.getItem(key));
  },
  removeItem: (key: string) => {
    return Promise.resolve(mmkvStorage.removeItem(key));
  },
};
console.log('storage adapter for redux-persist initialized', storage);

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
};

const rootReducer = combineReducers({
  auth: authReducer,
  lock: lockReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
