import { useQuery } from '@tanstack/react-query';
import {
  fetchProductsByCategory,
  fetchCategories,
  Product,
} from '../../api/productsApi';

export const useCategoryQuery = () => {
  return useQuery<string[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProductsByCategoryQuery = (category: string) => {
  return useQuery<Product[], Error>({
    queryKey: ['products', 'category', category],
    queryFn: () => fetchProductsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
