import React, { useEffect } from 'react';
import { PanResponder, View } from 'react-native';
import { autoLockService } from '../services/autoLock';

interface ActivityTrackerProps {
  children: React.ReactNode;
}

export const ActivityTracker: React.FC<ActivityTrackerProps> = ({
  children,
}) => {
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        // Reset auto-lock timer on any touch
        autoLockService.resetLockTimer();
        return false; // Don't consume the touch event
      },
      onMoveShouldSetPanResponder: () => {
        // Reset auto-lock timer on any movement
        autoLockService.resetLockTimer();
        return false; // Don't consume the touch event
      },
    }),
  ).current;

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      {children}
    </View>
  );
};
