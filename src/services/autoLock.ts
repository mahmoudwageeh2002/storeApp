import { AppState, AppStateStatus } from 'react-native';
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

  private constructor() {
    // Load lock state from storage
    this.isLocked =
      mmkvStorage.getItem(STORAGE_KEYS.APP_LOCK_ENABLED) === 'true';
    this.setupAppStateListener();
  }

  static getInstance(): AutoLockService {
    if (!AutoLockService.instance) {
      AutoLockService.instance = new AutoLockService();
    }
    return AutoLockService.instance;
  }

  // Setup app state listener for background/foreground detection
  private setupAppStateListener() {
    this.appStateSubscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
          // Lock immediately when app goes to background
          this.lock();
        } else if (nextAppState === 'active') {
          // Reset timer when app becomes active
          this.resetLockTimer();
        }
      },
    );
  }

  // Start the auto-lock timer
  startLockTimer() {
    this.clearLockTimer();

    if (!this.isLockEnabled()) {
      return;
    }

    this.lockTimeout = setTimeout(() => {
      this.lock();
    }, this.lockTimeoutDuration);
  }

  // Reset the auto-lock timer
  resetLockTimer() {
    if (this.isLocked) {
      return; // Don't reset timer if already locked
    }

    this.startLockTimer();
  }

  // Clear the auto-lock timer
  clearLockTimer() {
    if (this.lockTimeout) {
      clearTimeout(this.lockTimeout);
      this.lockTimeout = null;
    }
  }

  // Lock the app
  lock() {
    if (this.isLocked) {
      return; // Already locked
    }

    this.isLocked = true;
    this.clearLockTimer();
    this.notifyListeners(true);

    // Persist lock state
    mmkvStorage.setItem('app_currently_locked', 'true');
  }

  // Unlock the app
  unlock() {
    if (!this.isLocked) {
      return; // Already unlocked
    }

    this.isLocked = false;
    this.notifyListeners(false);
    this.resetLockTimer();

    // Remove current lock state
    mmkvStorage.removeItem('app_currently_locked');
  }

  // Check if the app is currently locked
  getIsLocked(): boolean {
    return this.isLocked;
  }

  // Check if auto-lock is enabled
  isLockEnabled(): boolean {
    return mmkvStorage.getItem(STORAGE_KEYS.APP_LOCK_ENABLED) === 'true';
  }

  // Enable auto-lock
  enableLock() {
    mmkvStorage.setItem(STORAGE_KEYS.APP_LOCK_ENABLED, 'true');
    this.resetLockTimer();
  }

  // Disable auto-lock
  disableLock() {
    mmkvStorage.setItem(STORAGE_KEYS.APP_LOCK_ENABLED, 'false');
    this.clearLockTimer();
    this.unlock();
  }

  // Set lock timeout duration
  setLockTimeout(duration: number) {
    this.lockTimeoutDuration = duration;
    if (!this.isLocked && this.isLockEnabled()) {
      this.resetLockTimer();
    }
  }

  // Add listener for lock state changes
  addListener(listener: LockStateListener) {
    this.listeners.push(listener);
  }

  // Remove listener
  removeListener(listener: LockStateListener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  // Notify all listeners
  private notifyListeners(isLocked: boolean) {
    this.listeners.forEach(listener => listener(isLocked));
  }

  // Clean up listeners and timers
  cleanup() {
    this.clearLockTimer();
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }
    this.listeners = [];
  }

  // Initialize the service (call this when app starts)
  initialize() {
    // Check if app was locked when it was closed
    const wasLocked = mmkvStorage.getItem('app_currently_locked') === 'true';
    if (wasLocked || this.isLockEnabled()) {
      this.lock();
    } else {
      this.resetLockTimer();
    }
  }
}

export const autoLockService = AutoLockService.getInstance();
