import { OrderDetailForOverview } from './order-detail-for-overview.model';
import { QuoteData } from './quote-data.model';

export interface QuoteView {
  status: boolean;
  status_type: string;
  data: QuoteData;
  details: OrderDetailForOverview[];
}
