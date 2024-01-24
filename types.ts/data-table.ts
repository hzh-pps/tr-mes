export interface ITableData {
  statisticItem: string;
  type: string;
  count: number;
  planned_quantity: number;
}

export type tableData = Array<ITableData>;
