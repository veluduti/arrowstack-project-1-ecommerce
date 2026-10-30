import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartSummaryData {
  itemsCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

