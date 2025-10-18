import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: any;
  thumbnail?: string;
  brand?: string;
  stock?: number;
}
interface Category {
  name: string;
  slug: string;
  uri: string;
}
const productsApi = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchAllProducts = async (): Promise<Product[]> => {
  const response = await productsApi.get('/products');

  // Transform DummyJSON products to match our Product interface
  return response.data.products.map((product: any) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    description: product.description,
    category: product.category,
    image: product.thumbnail || product.images?.[0] || '',
    rating: product.rating || 4.0,
    thumbnail: product.thumbnail,
    brand: product.brand,
    stock: product.stock,
  }));
};

export const fetchProductsByCategory = async (
  category: Category,
): Promise<Product[]> => {
  const response = await productsApi.get(`/products/category/${category.name}`);

  // Transform DummyJSON products to match our Product interface
  return response.data.products.map((product: any) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    description: product.description,
    category: product.category,
    image: product.thumbnail || product.images?.[0] || '',
    rating: product.rating || 4.0,
    thumbnail: product.thumbnail,
    brand: product.brand,
    stock: product.stock,
  }));
};

export const fetchCategories = async (): Promise<string[]> => {
  const response = await productsApi.get('/products/categories');
  return response.data;
};
