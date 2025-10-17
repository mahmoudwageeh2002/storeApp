import ReactNativeBiometrics from 'react-native-biometrics';
import { Alert } from 'react-native';

const rnBiometrics = new ReactNativeBiometrics();

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

export class BiometricAuthService {
  // Check if biometric authentication is available
  static async isBiometricAvailable(): Promise<{
    available: boolean;
    biometryType?: string;
    error?: string;
  }> {
    try {
      const { available, biometryType } =
        await rnBiometrics.isSensorAvailable();
      return {
        available,
        biometryType,
      };
    } catch (error) {
      return {
        available: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Check if biometric authentication is enabled for the user
  static async isBiometricEnabled(): Promise<boolean> {
    try {
      const { available } = await rnBiometrics.isSensorAvailable();
      return available;
    } catch (error) {
      return false;
    }
  }

  // Prompt for biometric authentication
  static async authenticate(
    promptMessage: string = 'Please verify your identity',
  ): Promise<BiometricAuthResult> {
    try {
      const { available } = await rnBiometrics.isSensorAvailable();

      if (!available) {
        return {
          success: false,
          error: 'Biometric authentication is not available',
        };
      }

      const { success } = await rnBiometrics.simplePrompt({
        promptMessage,
        fallbackPromptMessage: 'Use Password',
      });

      return { success };
    } catch (error) {
      if (error instanceof Error) {
        // Handle user cancellation
        if (
          error.message.includes('User canceled') ||
          error.message.includes('User cancelled') ||
          error.message.includes('UserCancel')
        ) {
          return {
            success: false,
            error: 'Authentication was cancelled',
          };
        }
      }

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Biometric authentication failed',
      };
    }
  }

  // Show alert for biometric setup
  static showBiometricSetupAlert(
    onSetup: () => void,
    onCancel?: () => void,
  ): void {
    Alert.alert(
      'Enable Biometric Authentication',
      'Would you like to enable biometric authentication for faster login?',
      [
        {
          text: 'Not Now',
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: 'Enable',
          onPress: onSetup,
        },
      ],
    );
  }
}
