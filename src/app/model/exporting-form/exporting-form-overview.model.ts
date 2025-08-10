import { ExportingFormDetailOverview } from './exporting-form-detail-overview.model';

export interface ExportingFormOverview {
  code: string;
  inventory_move_from_code: string;
  inventory_move_to_code: string;
  create_employee: string;
  commit_employee: string;
  transporter_code: string;
  details: ExportingFormDetailOverview[];
}
