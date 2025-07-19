import { OrderDetailWithExpectedPrice } from './order-detail-with-expected-price.model';

export interface OrderAggregator {
  supplier: number;
  order_details: OrderDetailWithExpectedPrice[];
}
