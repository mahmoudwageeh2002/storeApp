import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthNavigator } from './AuthNavigator';
import { AllProductsScreen } from '../screens/AllProductsScreen';
import { CategoryScreen } from '../screens/CategoryScreen';
import { CategoryProductsScreen } from '../screens/CategoryProductsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LockOverlay } from '../components/LockOverlay';
// import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
export type CategoryStackParamList = {
  CategoryList: undefined;
  CategoryProducts: { category: any };
};

export type MainTabParamList = {
  Products: undefined;
  Categories: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const CategoryStack = createNativeStackNavigator<CategoryStackParamList>();
const CategoryStackNavigator: React.FC = () => {
  return (
    <CategoryStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <CategoryStack.Screen name="CategoryList" component={CategoryScreen} />
      <CategoryStack.Screen
        name="CategoryProducts"
        component={CategoryProductsScreen}
      />
    </CategoryStack.Navigator>
  );
};

const MainTabNavigator: React.FC = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.separator,
          paddingBottom: 4,
          height: Platform.OS === 'ios' ? 80 : 60,
        },
        tabBarLabelStyle: {
          fontSize: typography.fontSizes.sm,
          fontWeight: typography.fontWeights.medium,
        },
      }}
    >
      <Tab.Screen
        name="Products"
        component={AllProductsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cart-outline" size={size || 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoryStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="grid-outline" size={size || 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" size={size || 24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
      <LockOverlay />
    </>
  );
};
