export interface Transaction {
  _id: string;
  folioNumber: string;
  schemeName: string;
  date: string;
  type: "PURCHASE" | "REDEMPTION";
  amount: number;
  units: number;
  nav: number;
  currentNav: number; // Added to interface based on new schema
}

export interface PortfolioAnalyticsProps {
  transactions: Transaction[];
}
