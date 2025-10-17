import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import lockReducer from '../features/lock/lockSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    lock: lockReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
