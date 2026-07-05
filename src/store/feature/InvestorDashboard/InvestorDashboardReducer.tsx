// store/transactionSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Investor } from "@/types/InvestorType";

interface InvestorDashboardState {
  list: Investor[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InvestorDashboardState = {
  list: [],
  status: "idle",
  error: null as string | null,
};

const investorDashboardSlice = createSlice({
  name: "investorDashboard",
  initialState,
  reducers: {
    getInvestorListAction(state) {
      state.status = "idle";
    },

    getInvestorList(state, action: PayloadAction<Investor[]>) {
      state.list = action.payload;
      state.status = "loading";
    },

    setInvestorList(state, action: PayloadAction<Investor[]>) {
      state.list = action.payload;
      state.status = "succeeded";
    },
  },
});

export const investorDashboardSliceActions = {
  ...investorDashboardSlice.actions,
};

export default investorDashboardSlice.reducer;
