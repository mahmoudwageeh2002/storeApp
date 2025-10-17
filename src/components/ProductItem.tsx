import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Product } from '../api/productsApi';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { formatPrice, truncateText } from '../utils/helpers';
import { useTheme } from '../context/ThemeContext';
interface ProductItemProps {
  product: Product;
  onPress?: (product: Product) => void;
  showDeleteButton?: boolean;
  onDelete?: (product: Product) => void;
}

const { width } = Dimensions.get('window');
const itemWidth = (width - 30) / 2; // 2 columns with margins

export const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onPress,
  showDeleteButton = false,
  onDelete,
}) => {
  const { colors } = useTheme();
  const currentStyles = styles(colors);
  return (
    <TouchableOpacity
      style={currentStyles.container}
      onPress={() => onPress?.(product)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: product.image }} style={currentStyles.image} />
      <View style={currentStyles.content}>
        <Text style={currentStyles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={currentStyles.price}>{formatPrice(product.price)}</Text>
        <View style={currentStyles.rating}>
          <Text style={currentStyles.ratingText}>{product.rating}</Text>
          <Text style={currentStyles.ratingCount}>({product.stock})</Text>
        </View>
        {showDeleteButton && (
          <TouchableOpacity
            style={currentStyles.deleteButton}
            onPress={() => onDelete?.(product)}
            activeOpacity={0.7}
          >
            <Text style={currentStyles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: itemWidth,
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      marginBottom: 16,
      shadowColor: colors.dark,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    image: {
      width: '100%',
      height: 150,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      resizeMode: 'contain',
    },
    content: {
      padding: 12,
    },
    title: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.medium,
      color: colors.textPrimary,
      marginBottom: 8,
      lineHeight: typography.lineHeights.normal * typography.fontSizes.sm,
    },
    price: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold,
      color: colors.primary,
      marginBottom: 4,
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
      marginRight: 4,
    },
    ratingCount: {
      fontSize: typography.fontSizes.xs,
      color: colors.textTertiary,
    },
    deleteButton: {
      backgroundColor: colors.danger,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      marginTop: 8,
      alignSelf: 'flex-start',
    },
    deleteButtonText: {
      color: colors.background,
      fontSize: typography.fontSizes.xs,
      fontWeight: typography.fontWeights.medium,
    },
  });
