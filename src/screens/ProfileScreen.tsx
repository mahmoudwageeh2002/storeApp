import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../features/auth/useAuth';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme/typography';

export const ProfileScreen: React.FC = () => {
  const { user, logout, fetchProfile, authLoading, isAuthenticated } =
    useAuth();
  const { colors, isDarkMode, toggleDarkMode } = useTheme();

  // Fetch fresh user profile data when component mounts
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          console.log('User signed out', isAuthenticated);
        },
      },
    ]);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return colors.danger;
      default:
        return colors.primary;
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };

  const currentStyles = styles(colors);

  if (authLoading) {
    return (
      <SafeAreaView style={currentStyles.container}>
        <View style={currentStyles.errorContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={currentStyles.container}>
        <View style={currentStyles.errorContainer}>
          <Text style={currentStyles.errorText}>User data not available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={currentStyles.container}>
      <View style={currentStyles.header}>
        <Text style={currentStyles.title}>Profile</Text>
      </View>

      <View style={currentStyles.content}>
        <View style={currentStyles.profileCard}>
          <View style={currentStyles.avatarContainer}>
            <View style={currentStyles.avatar}>
              <Text style={currentStyles.avatarText}>
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </Text>
            </View>
          </View>

          <View style={currentStyles.userInfo}>
            <Text style={currentStyles.userName}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={currentStyles.userEmail}>{user.email}</Text>
            <Text style={currentStyles.username}>@{user.username}</Text>

            <View
              style={[
                currentStyles.roleBadge,
                { backgroundColor: getRoleBadgeColor(user.role) },
              ]}
            >
              <Text style={currentStyles.roleText}>
                {getRoleDisplayName(user.role)}
              </Text>
            </View>
          </View>
        </View>

        <View style={currentStyles.infoSection}>
          <View style={currentStyles.infoRow}>
            <Text style={currentStyles.infoLabel}>User ID:</Text>
            <Text style={currentStyles.infoValue}>{user.id}</Text>
          </View>
          <View style={currentStyles.infoRow}>
            <Text style={currentStyles.infoLabel}>Username:</Text>
            <Text style={currentStyles.infoValue}>{user.username}</Text>
          </View>
          <View style={currentStyles.infoRow}>
            <Text style={currentStyles.infoLabel}>Role:</Text>
            <Text style={currentStyles.infoValue}>
              {getRoleDisplayName(user.role)}
            </Text>
          </View>
          {user.role === 'admin' && (
            <View style={currentStyles.adminNote}>
              <Text style={currentStyles.adminNoteText}>
                🔐 As an Admin, you have access to delete products in the store.
              </Text>
            </View>
          )}
          <View style={currentStyles.darkModeSection}>
            <Text style={currentStyles.infoLabel}>Dark Mode:</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.separator, true: colors.primary }}
              thumbColor={isDarkMode ? colors.background : colors.textPrimary}
            />
          </View>
        </View>

        <TouchableOpacity
          style={currentStyles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={currentStyles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    title: {
      fontSize: typography.fontSizes.xxl,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    profileCard: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      marginBottom: 24,
      shadowColor: colors.dark,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    avatarContainer: {
      marginBottom: 16,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: typography.fontSizes.xxl,
      fontWeight: typography.fontWeights.bold,
      color: colors.background,
    },
    userInfo: {
      alignItems: 'center',
    },
    userName: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: typography.fontSizes.md,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    username: {
      fontSize: typography.fontSizes.sm,
      color: colors.textTertiary,
      marginBottom: 12,
    },
    roleBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    roleText: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.medium,
      color: colors.background,
    },
    infoSection: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    infoLabel: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.medium,
      color: colors.textPrimary,
    },
    infoValue: {
      fontSize: typography.fontSizes.md,
      color: colors.textSecondary,
    },
    adminNote: {
      marginTop: 16,
      padding: 12,
      backgroundColor: colors.warning + '20',
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.warning,
    },
    adminNoteText: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
      lineHeight: typography.lineHeights.relaxed * typography.fontSizes.sm,
    },
    darkModeSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      marginTop: 8,
    },
    logoutButton: {
      backgroundColor: colors.danger,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
    },
    logoutButtonText: {
      color: colors.background,
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      fontSize: typography.fontSizes.lg,
      color: colors.danger,
    },
  });
