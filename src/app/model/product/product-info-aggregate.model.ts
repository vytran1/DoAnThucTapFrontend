import { ProductAttributeModel } from './product-attribute.model';
import { ProductVariantModel } from './product-variant-table.model';

export interface ProductInfoAggregateModel {
  product_name: string;
  brand: number;
  category: number;
  product_attributes: ProductAttributeModel[];
  product_variants: ProductVariantModel[];
}
