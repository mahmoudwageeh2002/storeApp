import {
  AppState,
  AppStateStatus,
  PanResponder,
  GestureResponderEvent,
} from 'react-native';
import { mmkvStorage } from '../storage/mmkv';
import { STORAGE_KEYS } from '../utils/constants';

export type LockStateListener = (isLocked: boolean) => void;

export class AutoLockService {
  private static instance: AutoLockService;
  private lockTimeout: number | null = null;
  private isLocked: boolean = false;
  private listeners: LockStateListener[] = [];
  private lockTimeoutDuration: number = 10000; // 10 seconds
  private appStateSubscription: any = null;
  private panResponder: any = null;

  private constructor() {
    // Load lock state from storage
    this.isLocked =
      mmkvStorage.getItem(STORAGE_KEYS.APP_LOCK_ENABLED) === 'true';
    this.setupAppStateListener();
    this.setupGestureListeners();
  }

  static getInstance(): AutoLockService {
    if (!AutoLockService.instance) {
      AutoLockService.instance = new AutoLockService();
    }
    return AutoLockService.instance;
  }

  // 🔹 App state listener (background / foreground)
  private setupAppStateListener() {
    this.appStateSubscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
          this.lock();
        } else if (nextAppState === 'active') {
          this.resetLockTimer();
        }
      },
    );
  }

  // 🔹 Global gesture listeners (user activity)
  private setupGestureListeners() {
    // PanResponder catches touches, scrolls, drags, etc.
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderGrant: this.handleUserActivity,
      onPanResponderMove: this.handleUserActivity,
      onPanResponderRelease: this.handleUserActivity,
    });
  }

  // Call this from a top-level component like App.tsx
  getGestureHandlers() {
    return this.panResponder ? this.panResponder.panHandlers : {};
  }

  // 🔹 Called whenever user interacts
  private handleUserActivity = (e: GestureResponderEvent) => {
    this.resetLockTimer();
  };

  // 🔹 Start lock timer
  startLockTimer() {
    this.clearLockTimer();
    if (!this.isLockEnabled()) return;

    this.lockTimeout = setTimeout(() => {
      this.lock();
    }, this.lockTimeoutDuration);
  }

  // 🔹 Reset lock timer
  resetLockTimer() {
    if (this.isLocked) return;
    this.startLockTimer();
  }

  // 🔹 Clear lock timer
  clearLockTimer() {
    if (this.lockTimeout) {
      clearTimeout(this.lockTimeout);
      this.lockTimeout = null;
    }
  }

  // 🔹 Lock the app
  lock() {
    if (this.isLocked) return;
    this.isLocked = true;
    this.clearLockTimer();
    this.notifyListeners(true);
    mmkvStorage.setItem('app_currently_locked', 'true');
  }

  // 🔹 Unlock the app
  unlock() {
    if (!this.isLocked) return;
    this.isLocked = false;
    this.notifyListeners(false);
    this.resetLockTimer();
    mmkvStorage.removeItem('app_currently_locked');
  }

  getIsLocked(): boolean {
    return this.isLocked;
  }

  isLockEnabled(): boolean {
    return mmkvStorage.getItem(STORAGE_KEYS.APP_LOCK_ENABLED) === 'true';
  }

  enableLock() {
    mmkvStorage.setItem(STORAGE_KEYS.APP_LOCK_ENABLED, 'true');
    this.resetLockTimer();
  }

  disableLock() {
    mmkvStorage.setItem(STORAGE_KEYS.APP_LOCK_ENABLED, 'false');
    this.clearLockTimer();
    this.unlock();
  }

  setLockTimeout(duration: number) {
    this.lockTimeoutDuration = duration;
    if (!this.isLocked && this.isLockEnabled()) {
      this.resetLockTimer();
    }
  }

  addListener(listener: LockStateListener) {
    this.listeners.push(listener);
  }

  removeListener(listener: LockStateListener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners(isLocked: boolean) {
    this.listeners.forEach(listener => listener(isLocked));
  }

  cleanup() {
    this.clearLockTimer();
    if (this.appStateSubscription) this.appStateSubscription.remove();
    this.listeners = [];
  }

  initialize() {
    const wasLocked = mmkvStorage.getItem('app_currently_locked') === 'true';
    if (wasLocked || this.isLockEnabled()) {
      this.lock();
    } else {
      this.resetLockTimer();
    }
  }
}

export const autoLockService = AutoLockService.getInstance();
