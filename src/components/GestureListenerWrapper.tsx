import React from 'react';
import { View, ViewProps } from 'react-native';
import { autoLockService } from '../services/autoLock';

export const GestureListenerWrapper: React.FC<ViewProps> = ({
  children,
  style,
}) => {
  const gestureHandlers = autoLockService.getGestureHandlers();

  return (
    <View style={[{ flex: 1 }, style]} {...gestureHandlers}>
      {children}
    </View>
  );
};
