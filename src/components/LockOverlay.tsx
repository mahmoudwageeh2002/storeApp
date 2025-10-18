import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useBiometricAuth } from '../hooks/useBiometricAuth';
import { useAppLock } from '../hooks/useAppLock';
import { useAuth } from '../features/auth/useAuth';

const { width, height } = Dimensions.get('window');

export const LockOverlay: React.FC = () => {
  const { isLocked, unlock } = useAppLock();
  const { authenticate, isAvailable } = useBiometricAuth();
  const { logout } = useAuth();

  const handleSessionEnd = () => {
    // Force logout and navigate to login screen
    unlock(); // Unlock first to avoid infinite modal
    logout();
  };

  const handleUnlock = async () => {
    if (isAvailable) {
      const success = await authenticate();
      if (success) {
        unlock();
      } else {
        // If biometric auth fails, show session expired option
        handleSessionEnd();
      }
    } else {
      // If no biometric available, force session end
      handleSessionEnd();
    }
  };

  if (!isLocked) return null;

  return (
    <Modal
      visible={isLocked}
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={() => {}} // Prevent closing on Android back button
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.icon}>⏰</Text>
          <Text style={styles.title}>Session Expired</Text>
          <Text style={styles.subtitle}>
            Your session has expired for security reasons. Please sign in again
            to continue.
          </Text>

          {isAvailable && (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleUnlock}
            >
              <Text style={styles.biometricButtonText}>
                🔐 Unlock with Biometrics
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSessionEnd}
          >
            <Text style={styles.loginButtonText}>Sign In Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.8,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: typography.lineHeights.relaxed * typography.fontSizes.md,
  },
  unlockButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  unlockButtonText: {
    color: colors.background,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  biometricButton: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 16,
  },
  biometricButtonText: {
    color: colors.primary,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
  loginButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 200,
  },
  loginButtonText: {
    color: colors.background,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
    textAlign: 'center',
  },
});
