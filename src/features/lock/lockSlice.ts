import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mmkvStorage } from '../../storage/mmkv';
import { STORAGE_KEYS } from '../../utils/constants';

interface LockState {
  isLocked: boolean;
  lockEnabled: boolean;
  isBiometricAvailable: boolean;
}

const initialState: LockState = {
  isLocked: false,
  lockEnabled: mmkvStorage.getItem(STORAGE_KEYS.APP_LOCK_ENABLED) === 'true',
  isBiometricAvailable: false,
};

const lockSlice = createSlice({
  name: 'lock',
  initialState,
  reducers: {
    lockApp: state => {
      state.isLocked = true;
    },
    unlockApp: state => {
      state.isLocked = false;
    },
    enableLock: state => {
      state.lockEnabled = true;
      mmkvStorage.setItem(STORAGE_KEYS.APP_LOCK_ENABLED, 'true');
    },
    disableLock: state => {
      state.lockEnabled = false;
      state.isLocked = false;
      mmkvStorage.removeItem(STORAGE_KEYS.APP_LOCK_ENABLED);
    },
    setBiometricAvailable: (state, action: PayloadAction<boolean>) => {
      state.isBiometricAvailable = action.payload;
    },
  },
});

export const {
  lockApp,
  unlockApp,
  enableLock,
  disableLock,
  setBiometricAvailable,
} = lockSlice.actions;
export default lockSlice.reducer;
