export interface InvestorSummaryData {
  name: string;
  totalInvestment: number;
  currentMarketValue: number;
  totalGainLoss: number;
  absoluteReturn: number;
  xirr: number;
  schemeCount: number;
  folioCount: number;
}

export interface PortfolioSummaryProps {
  data: InvestorSummaryData;
}
