export interface ProductVariantWithStock {
  id: number;
  parentId: number;
  name: string;
  sku: string;
  image: string;
  current_quantity: number;
  cost_price: number;
}
