import { useState, useEffect } from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export const useBiometricAuth = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState<string | null>(null);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const { available, biometryType: type } =
        await rnBiometrics.isSensorAvailable();
      setIsAvailable(available);
      setBiometryType(type || null);
    } catch (error) {
      console.log('Biometric check error:', error);
      setIsAvailable(false);
    }
  };

  const authenticate = async (): Promise<boolean> => {
    try {
      if (!isAvailable) return false;

      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to unlock the app',
      });

      return success;
    } catch (error) {
      console.log('Biometric auth error:', error);
      return false;
    }
  };

  return {
    isAvailable,
    biometryType,
    authenticate,
  };
};
