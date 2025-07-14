export interface ProductVariantDetailModel {
  name: string;
  sku: string;
  price: number;
  default?: boolean;
  attributes?: { [key: string]: string };
}
