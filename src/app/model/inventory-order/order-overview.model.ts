import { OrderDetailForOverview } from './order-detail-for-overview.model';

export interface OrderOverview {
  order_code: string;
  employee: string;
  current_status: string;
  created_at: string;
  completed_at: string;
  line_items: number;
}
