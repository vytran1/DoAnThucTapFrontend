import { ImportingFormDetailOverview } from './importing-form-detail-overview.model';

export interface ImportingFormOverview {
  code: string;
  employee: string;
  created_at: string;
  line_items: number;
  details: ImportingFormDetailOverview[];
}
