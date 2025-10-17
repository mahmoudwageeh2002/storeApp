import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProductsByCategoryQuery } from '../features/products/useCategoryQuery';
import { ProductItem } from '../components/ProductItem';
import { OfflineBanner } from '../components/OfflineBanner';
import { Product } from '../api/productsApi';
import { useAuth } from '../features/auth/useAuth';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';
interface Category {
  name: string;
  slug: string;
  uri: string;
}
export type CategoryStackParamList = {
  CategoryList: undefined;
  CategoryProducts: { category: Category };
};

type CategoryProductsScreenRouteProp = RouteProp<
  CategoryStackParamList,
  'CategoryProducts'
>;
type CategoryProductsScreenNavigationProp = NativeStackNavigationProp<
  CategoryStackParamList,
  'CategoryProducts'
>;

interface CategoryProductsScreenProps {
  route: CategoryProductsScreenRouteProp;
  navigation: CategoryProductsScreenNavigationProp;
}

export const CategoryProductsScreen: React.FC<CategoryProductsScreenProps> = ({
  route,
  navigation,
}) => {
  const { category } = route.params;
  const { user } = useAuth();
  const { colors } = useTheme();
  const currentStyles = styles(colors);
  const [deletedProducts, setDeletedProducts] = useState<Set<number>>(
    new Set(),
  );

  const {
    data: products,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useProductsByCategoryQuery(category);

  const filteredProducts = products?.filter(
    product => !deletedProducts.has(product.id),
  );

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

  const renderEmpty = () => (
    <View style={currentStyles.emptyContainer}>
      <Text style={currentStyles.emptyText}>
        No products found in {category.name}
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={currentStyles.errorContainer}>
      <Text style={currentStyles.errorText}>Failed to load products</Text>
      <Text style={currentStyles.errorSubtext}>Pull down to retry</Text>
    </View>
  );

  const formatCategoryTitle = (cat: string) => {
    return cat.name;
  };

  if (isLoading) {
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
        <TouchableOpacity
          style={currentStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={currentStyles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={currentStyles.title}>{category.name}</Text>
        <Text style={currentStyles.subtitle}>
          {filteredProducts?.length || 0} products
        </Text>
      </View>

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
    backButton: {
      marginBottom: 8,
    },
    backButtonText: {
      fontSize: typography.fontSizes.md,
      color: colors.primary,
      fontWeight: typography.fontWeights.medium,
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
  });
