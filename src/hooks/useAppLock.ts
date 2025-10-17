import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import {
  lockApp,
  unlockApp,
  enableLock,
  disableLock,
} from '../features/lock/lockSlice';

export const useAppLock = () => {
  const dispatch = useDispatch();
  const { isLocked, lockEnabled, isBiometricAvailable } = useSelector(
    (state: RootState) => state.lock,
  );

  const lock = () => {
    dispatch(lockApp());
  };

  const unlock = () => {
    dispatch(unlockApp());
  };

  const enable = () => {
    dispatch(enableLock());
  };

  const disable = () => {
    dispatch(disableLock());
  };

  return {
    isLocked,
    lockEnabled,
    isBiometricAvailable,
    lock,
    unlock,
    enable,
    disable,
  };
};
