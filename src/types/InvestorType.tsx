export interface Investor {
  id: string | number;
  name: string;
  panNumber: string;
  folioCount: number;
  totalInvestment: number;
  currentValue: number;
  absoluteReturn: number;
  xirr: number;
}
