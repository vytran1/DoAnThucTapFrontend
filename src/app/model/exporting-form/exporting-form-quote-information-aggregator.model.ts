import { ExportingQuoteInformation } from './exporting-quote-information.model';

export interface ExportingFormQuoteInformationAggregator {
  total_quantity: number;
  total_value_without_discount: number;
  total_value_with_discount: number;
  quote_price_date: ExportingQuoteInformation;
  has_quote: boolean;
  reject: boolean;
}
