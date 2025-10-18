import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../features/auth/useAuth';
import { useBiometricAuth } from '../hooks/useBiometricAuth';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { autoLockService } from '../services/autoLock';
import { store } from '../store/store';
import { lockApp, unlockApp } from '../features/lock/lockSlice';

export const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [shouldInitializeLock, setShouldInitializeLock] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { login, authLoading: loading, error, isAuthenticated } = useAuth();

  const { isAvailable, biometryType, authenticate } = useBiometricAuth();

  // Initialize auto-lock service after successful login
  useEffect(() => {
    if (shouldInitializeLock) {
      autoLockService.initialize();
      autoLockService.enableLock();

      const updateReduxLockState = (isLocked: boolean) => {
        if (isLocked) {
          store.dispatch(lockApp());
        } else {
          store.dispatch(unlockApp());
        }
      };

      autoLockService.addListener(updateReduxLockState);
      setShouldInitializeLock(false);

      return () => {
        autoLockService.removeListener(updateReduxLockState);
        autoLockService.cleanup();
      };
    }
  }, [shouldInitializeLock]);

  const handleLogin = async () => {
    // Clear previous validation message
    setValidationError(null);

    if (!username || !password) {
      setValidationError('Please enter both username and password');
      return;
    }

    const result = await login({ username, password });
    console.log('login result:', result);

    // if (result || result !== false) {
    //   setShouldInitializeLock(true);
    // }
  };

  const handleBiometricLogin = async () => {
    try {
      const success = await authenticate();
      if (success) {
        const result = await login({
          username: 'emilys',
          password: 'emilyspass',
        });

        // if (result || result !== false) {
        //   setShouldInitializeLock(true);
        // }
      }
    } catch {
      setValidationError('Biometric authentication failed');
    }
  };

  const getBiometricButtonText = () => {
    switch (biometryType) {
      case 'FaceID':
        return '👤 Sign in with Face ID';
      case 'TouchID':
        return '👆 Sign in with Touch ID';
      default:
        return '🔐 Sign in with Biometrics';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to Store App</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <View style={styles.form}>
            {/* Username */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Inline validation error */}
            {validationError && (
              <Text style={styles.errorText}>{validationError}</Text>
            )}

            {/* Auth error from backend */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Sign In button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Biometric login */}
            {isAvailable && (
              <>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.biometricButton}
                  onPress={handleBiometricLogin}
                  disabled={loading}
                >
                  <Text style={styles.biometricButtonText}>
                    {getBiometricButtonText()}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: typography.fontSizes.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: typography.fontSizes.md,
    backgroundColor: colors.backgroundSecondary,
    color: colors.textPrimary,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.fontSizes.sm,
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: colors.background,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.separator,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  biometricButton: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  biometricButtonText: {
    color: colors.primary,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
});
