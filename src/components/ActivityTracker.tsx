import React, { useEffect } from 'react';
import {
  View,
  Keyboard,
  AppState,
  AppStateStatus,
  TouchableWithoutFeedback,
} from 'react-native';
import { autoLockService } from '../services/autoLock';
import { navigationRef } from '../navigation/navigationRef';

interface ActivityTrackerProps {
  children: React.ReactNode;
}

export const ActivityTracker: React.FC<ActivityTrackerProps> = ({
  children,
}) => {
  useEffect(() => {
    // 🧭 Keyboard activity
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      autoLockService.resetLockTimer(),
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      autoLockService.resetLockTimer(),
    );

    // 🧭 Navigation activity
    const unsubscribeNav = navigationRef.addListener('state', () => {
      autoLockService.resetLockTimer();
    });

    // 🌓 App returns to foreground
    const appStateSub = AppState.addEventListener(
      'change',
      (state: AppStateStatus) => {
        if (state === 'active') {
          autoLockService.resetLockTimer();
        }
      },
    );

    return () => {
      showSub.remove();
      hideSub.remove();
      unsubscribeNav();
      appStateSub.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => autoLockService.resetLockTimer()}
      onTouchStart={() => autoLockService.resetLockTimer()}
      accessible={false}
    >
      <View style={{ flex: 1 }}>{children}</View>
    </TouchableWithoutFeedback>
  );
};
