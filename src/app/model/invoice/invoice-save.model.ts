import { InvoiceDetail } from './invoice-detail-save.model';

export interface Invoice {
  quantity: number;
  tax: number;
  total: number;
  details: InvoiceDetail[];
}
