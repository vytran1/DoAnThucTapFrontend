export interface RestockSuggestion {
  sku: string;
  name: string;
  total_current_stocking: number;
  total_saled_quantity: number;
  average_saled_quantity: number;
  need_to_be_imported: boolean;
  predict_quantity_for_next_period: number;
}
