export type ProductCategory =
  | 'Electronics'
  | 'Fashion'
  | 'Home & Kitchen'
  | 'Accessories'
  | 'Beauty';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number; // in INR (₹)
  originalPrice?: number; // for discount display
  discountPercentage?: number;
  image: string;
  rating: number; // 0 to 5
  reviewCount: number;
  stock: number;
  popularity: number; // 0 to 100
  featured?: boolean;
  bestSeller?: boolean;
  brand?: string;
  specs?: Record<string, string>;
}

export type SortOption =
  | 'price-low-to-high'
  | 'price-high-to-low'
  | 'alphabetical'
  | 'popularity'
  | 'rating';

export interface ProductFiltersState {
  search: string;
  category: string; // 'All' or specific category
  minPrice: number;
  maxPrice: number;
  sortBy: SortOption;
}
