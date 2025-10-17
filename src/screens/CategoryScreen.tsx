import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCategoryQuery } from '../features/products/useCategoryQuery';
import { OfflineBanner } from '../components/OfflineBanner';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';
type CategoryStackParamList = {
  CategoryList: undefined;
  CategoryProducts: { category: string };
};

type CategoryScreenNavigationProp = NativeStackNavigationProp<
  CategoryStackParamList,
  'CategoryList'
>;

interface CategoryScreenProps {
  navigation: CategoryScreenNavigationProp;
}

export const CategoryScreen: React.FC<CategoryScreenProps> = ({
  navigation,
}) => {
  const { data: categories, isLoading, error, refetch } = useCategoryQuery();
  const { colors } = useTheme();
  const currentStyles = styles(colors);
  const handleCategoryPress = (category: string) => {
    navigation.navigate('CategoryProducts', { category });
  };

  const renderCategory = (category: string, index: number) => (
    <TouchableOpacity
      key={index}
      style={currentStyles.categoryCard}
      onPress={() => handleCategoryPress(category)}
      activeOpacity={0.7}
    >
      <Text style={currentStyles.categoryEmoji}>
        {getCategoryEmoji(category)}
      </Text>
      <Text style={currentStyles.categoryTitle}>
        {formatCategoryName(category)}
      </Text>
    </TouchableOpacity>
  );

  const formatCategoryName = (category: string): string => {
    return category.name;
  };

  const getCategoryEmoji = (category: string): string => {
    switch (category.name.toLowerCase()) {
      case 'smartphones':
        return '📱';
      case 'laptops':
        return '💻';
      case 'fragrances':
        return '🌸';
      case 'skincare':
        return '🧴';
      case 'groceries':
        return '🛒';
      case 'home-decoration':
        return '🏠';
      case 'furniture':
        return '🪑';
      case 'tops':
      case 'mens-shirts':
        return '👕';
      case 'womens-dresses':
        return '�';
      case 'mens-shoes':
      case 'womens-shoes':
        return '👟';
      case 'mens-watches':
      case 'womens-watches':
        return '⌚';
      case 'womens-bags':
        return '👜';
      case 'womens-jewellery':
        return '💍';
      case 'sunglasses':
        return '🕶️';
      case 'automotive':
        return '�';
      case 'motorcycle':
        return '🏍️';
      case 'lighting':
        return '�';
      default:
        return '🛍️';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={currentStyles.container}>
        <OfflineBanner />
        <View style={currentStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={currentStyles.loadingText}>Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={currentStyles.container}>
        <OfflineBanner />
        <View style={currentStyles.errorContainer}>
          <Text style={currentStyles.errorText}>Failed to load categories</Text>
          <TouchableOpacity
            style={currentStyles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={currentStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={currentStyles.container}>
      <OfflineBanner />
      <View style={currentStyles.header}>
        <Text style={currentStyles.title}>Categories</Text>
        <Text style={currentStyles.subtitle}>Browse products by category</Text>
      </View>

      <ScrollView
        contentContainerStyle={currentStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={currentStyles.categoriesGrid}>
          {categories?.map(renderCategory)}
        </View>
      </ScrollView>
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
      marginBottom: 4,
    },
    subtitle: {
      fontSize: typography.fontSizes.md,
      color: colors.textSecondary,
    },
    scrollContainer: {
      padding: 16,
    },
    categoriesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    categoryCard: {
      width: '48%',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      alignItems: 'center',
      shadowColor: colors.dark,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    categoryEmoji: {
      fontSize: 48,
      marginBottom: 12,
    },
    categoryTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 16,
      fontSize: typography.fontSizes.md,
      color: colors.textSecondary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      fontSize: typography.fontSizes.lg,
      color: colors.danger,
      marginBottom: 16,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    retryButtonText: {
      color: colors.background,
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.medium,
    },
  });
