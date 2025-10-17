import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProductsQuery } from '../features/products/useProductsQuery';
import {
  useCategoryQuery,
  useProductsByCategoryQuery,
} from '../features/products/useCategoryQuery';
import { ProductItem } from '../components/ProductItem';
import { OfflineBanner } from '../components/OfflineBanner';
import { Product } from '../api/productsApi';
import { useAuth } from '../features/auth/useAuth';
// import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';
export const AllProductsScreen: React.FC = () => {
  const { user, token, fetchProfile, authLoading } = useAuth();
  const [deletedProducts, setDeletedProducts] = useState<Set<number>>(
    new Set(),
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch all products
  const {
    data: allProducts,
    isLoading: isLoadingAll,
    error: allProductsError,
    refetch: refetchAll,
    isRefetching: isRefetchingAll,
  } = useProductsQuery();

  // Fetch products by category
  const {
    data: categoryProducts,
    isLoading: isLoadingCategory,
    error: categoryError,
    refetch: refetchCategory,
    isRefetching: isRefetchingCategory,
  } = useProductsByCategoryQuery(selectedCategory || '');

  // Fetch categories
  const { data: categories } = useCategoryQuery();
  const { isDarkMode, colors } = useTheme();
  const currentStyles = styles(colors);

  // Determine which products to display
  const products = selectedCategory ? categoryProducts : allProducts;
  const isLoading = selectedCategory ? isLoadingCategory : isLoadingAll;
  const error = selectedCategory ? categoryError : allProductsError;
  const refetch = selectedCategory ? refetchCategory : refetchAll;
  const isRefetching = selectedCategory
    ? isRefetchingCategory
    : isRefetchingAll;

  const filteredProducts = products?.filter(
    product => !deletedProducts.has(product.id),
  );
  // ✅ only fetch profile once token is available
  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDeletedProducts(prev => new Set([...prev, product.id]));
            Alert.alert('Success', 'Product deleted successfully (simulated)');
          },
        },
      ],
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductItem
      product={item}
      onPress={product => console.log('Product pressed:', product)}
      onDelete={
        user?.role === 'admin' ? () => handleDeleteProduct(item) : undefined
      }
      showDeleteButton={user?.role === 'admin'}
    />
  );

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleResetCategory = () => {
    setSelectedCategory(null);
  };

  const renderCategoryFilter = () => (
    <View style={currentStyles.filterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={currentStyles.categoryScroll}
      >
        <TouchableOpacity
          style={[
            currentStyles.categoryChip,
            !selectedCategory && currentStyles.categoryChipSelected,
          ]}
          onPress={handleResetCategory}
        >
          <Text
            style={[
              currentStyles.categoryChipText,
              !selectedCategory && currentStyles.categoryChipTextSelected,
            ]}
          >
            All Products
          </Text>
        </TouchableOpacity>
        {categories?.map(category => (
          <TouchableOpacity
            key={category.slug}
            style={[
              currentStyles.categoryChip,
              selectedCategory === category &&
                currentStyles.categoryChipSelected,
            ]}
            onPress={() => handleCategorySelect(category)}
          >
            <Text
              style={[
                currentStyles.categoryChipText,
                selectedCategory === category &&
                  currentStyles.categoryChipTextSelected,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderEmpty = () => (
    <View style={currentStyles.emptyContainer}>
      <Text style={currentStyles.emptyText}>
        {selectedCategory
          ? `No products found in ${selectedCategory.name}`
          : 'No products found'}
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={currentStyles.errorContainer}>
      <Text style={currentStyles.errorText}>Failed to load products</Text>
      <Text style={currentStyles.errorSubtext}>Pull down to retry</Text>
    </View>
  );

  if (isLoading || authLoading) {
    return (
      <SafeAreaView style={currentStyles.container}>
        <OfflineBanner />
        <View style={currentStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={currentStyles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={currentStyles.container}>
      <OfflineBanner />
      <View style={currentStyles.header}>
        <Text style={currentStyles.title}>
          {selectedCategory
            ? `${selectedCategory.name} Products`
            : 'All Products'}
        </Text>
      </View>

      {renderCategoryFilter()}

      {error ? (
        renderError()
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={currentStyles.listContainer}
          columnWrapperStyle={currentStyles.row}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[colors.primary]}
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
    },
    listContainer: {
      padding: 16,
      gap: 16,
    },
    row: {
      justifyContent: 'space-between',
      gap: 8,
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
    filterContainer: {
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
      paddingVertical: 12,
    },
    categoryScroll: {
      paddingHorizontal: 16,
    },
    categoryChip: {
      backgroundColor: colors.backgroundSecondary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryChipSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryChipText: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.medium,
      color: colors.textPrimary,
    },
    categoryChipTextSelected: {
      color: colors.background,
    },
  });
