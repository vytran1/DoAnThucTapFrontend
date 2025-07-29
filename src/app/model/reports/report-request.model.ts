export interface ReportRequest {
  type: 'CUSTOM' | 'WEEK' | 'MONTH' | 'HALF_YEAR' | 'YEAR';
  start_date?: string;
  end_date?: string;
  inventory_id?: number | null;
}
