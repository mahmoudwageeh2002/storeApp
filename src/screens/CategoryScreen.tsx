import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCategoryQuery } from '../features/products/useCategoryQuery';
import { OfflineBanner } from '../components/OfflineBanner';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';

interface Category {
  name: string;
  slug: string;
  uri: string;
}

type CategoryStackParamList = {
  CategoryList: undefined;
  CategoryProducts: { category: Category };
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
  const {
    data: categories,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useCategoryQuery();
  const { colors } = useTheme();
  const currentStyles = styles(colors);

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('CategoryProducts', { category });
  };

  const renderCategory = ({
    item,
    index,
  }: {
    item: Category;
    index: number;
  }) => (
    <TouchableOpacity
      style={[
        currentStyles.categoryCard,
        index % 2 === 1
          ? currentStyles.categoryCardRight
          : currentStyles.categoryCardLeft,
      ]}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <Text style={currentStyles.categoryEmoji}>{getCategoryEmoji(item)}</Text>
      <Text style={currentStyles.categoryTitle}>
        {formatCategoryName(item)}
      </Text>
    </TouchableOpacity>
  );

  const formatCategoryName = (category: Category): string => {
    return category.name;
  };

  const getCategoryEmoji = (category: Category): string => {
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
        return '👗';
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
        return '🚗';
      case 'motorcycle':
        return '🏍️';
      case 'lighting':
        return '💡';
      default:
        return '🛍️';
    }
  };

  const renderEmpty = () => (
    <View style={currentStyles.emptyContainer}>
      <Text style={currentStyles.emptyText}>No categories found</Text>
    </View>
  );

  const renderError = () => (
    <View style={currentStyles.errorContainer}>
      <Text style={currentStyles.errorText}>Failed to load categories</Text>
      <Text style={currentStyles.errorSubtext}>Pull down to retry</Text>
    </View>
  );

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

  return (
    <SafeAreaView style={currentStyles.container}>
      <OfflineBanner />
      <View style={currentStyles.header}>
        <Text style={currentStyles.title}>Categories</Text>
        <Text style={currentStyles.subtitle}>Browse products by category</Text>
      </View>

      {error ? (
        renderError()
      ) : (
        <FlatList
          data={categories || []}
          renderItem={renderCategory}
          keyExtractor={(item, index) => `${item.slug}-${index}`}
          numColumns={2}
          contentContainerStyle={currentStyles.listContainer}
          columnWrapperStyle={currentStyles.row}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[colors.primary]} // Android
              tintColor={colors.primary} // iOS
              progressBackgroundColor={colors.backgroundSecondary} // Android background
            />
          }
        />
      )}
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
    listContainer: {
      padding: 16,
    },
    row: {
      justifyContent: 'space-between',
      gap: 8,
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
    categoryCardLeft: {
      marginRight: 4,
    },
    categoryCardRight: {
      marginLeft: 4,
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
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 60,
    },
    emptyText: {
      fontSize: typography.fontSizes.lg,
      color: colors.textSecondary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 60,
    },
    errorText: {
      fontSize: typography.fontSizes.lg,
      color: colors.danger,
      marginBottom: 8,
    },
    errorSubtext: {
      fontSize: typography.fontSizes.md,
      color: colors.textSecondary,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 16,
    },
    retryButtonText: {
      color: colors.background,
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.medium,
    },
  });
