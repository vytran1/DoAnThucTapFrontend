import { ExportingFormDetail } from './exporting-form-detail.model';

export interface ExportingFormAggregator {
  transporter: number;
  inventory: number;
  details: ExportingFormDetail[];
}
