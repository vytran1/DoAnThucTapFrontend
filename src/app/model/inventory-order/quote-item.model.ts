export interface QuoteItem {
  sku: string;
  product_name: string;
  quoted_price: number;
  currency: string;
  description: string;
  quantity?: number;
}
