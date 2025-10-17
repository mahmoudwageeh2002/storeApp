import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts, Product } from '../../api/productsApi';

export const useProductsQuery = () => {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
    staleTime: 5 * 60 * 1000,
  });
};
