import { QuoteInformation } from './quote-information.model';
import { QuoteItem } from './quote-item.model';

export interface QuoteData {
  quote_information: QuoteInformation;
  quote_items: QuoteItem[];
}
