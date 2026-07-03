export interface Transaction {
  _id: string;
  folioNumber: string;
  schemeName: string;
  date: string;
  type: "PURCHASE" | "REDEMPTION";
  amount: number;
  units: number;
  nav: number;
  currentNav: number;
}

export interface SchemeHolding {
  id: string; // Unique key (schemeName + folioNumber)
  schemeName: string;
  folioNumber: string;
  unitsHeld: number;
  avgPurchaseNav: number;
  currentNav: number;
  investedAmount: number;
  currentValue: number;
  gainLoss: number;
  returnPercent: number;
  xirr: number;
}

export interface SchemeHoldingsTableProps {
  transactions: Transaction[];
}
