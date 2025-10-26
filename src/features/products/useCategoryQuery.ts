import { useQuery } from '@tanstack/react-query';
import {
  fetchProductsByCategory,
  fetchCategories,
  Product,
} from '../../api/productsApi';

interface Category {
  name: string;
  slug: string;
  uri: string;
}

export const useCategoryQuery = () => {
  return useQuery<any[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProductsByCategoryQuery = (category: Category) => {
  return useQuery<Product[], Error>({
    queryKey: ['products', 'category', category],
    queryFn: () => fetchProductsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
