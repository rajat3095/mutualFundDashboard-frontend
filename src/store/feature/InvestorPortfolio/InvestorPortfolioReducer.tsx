// store/transactionSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SchemeHolding } from "@/types/PortfolioSchemeWiseHoldingsType";

interface InvestorPortfolioState {
  portfolioList: SchemeHolding[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InvestorPortfolioState = {
  portfolioList: [],
  status: "idle",
  error: null as string | null,
};

const investorPortfolioSlice = createSlice({
  name: "investorPortfolio",
  initialState,
  reducers: {
    getInvestorPortfolioListAction(state, action: PayloadAction<string>) {
      state.status = "idle";
    },

    getInvestorPortfolioList(state, action: PayloadAction<SchemeHolding[]>) {
      state.portfolioList = action.payload;
      state.status = "loading";
    },

    setInvestorPortfolioList(state, action: PayloadAction<SchemeHolding[]>) {
      state.portfolioList = action.payload;
      state.status = "succeeded";
    },
  },
});

export const investorPortfolioSliceActions = {
  ...investorPortfolioSlice.actions,
};

export default investorPortfolioSlice.reducer;
