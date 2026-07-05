import { RootState } from "@/store/index";

export const selectInvestorDashboard = (state: RootState) =>
  state.investorDashboard.list;

export const selectInvestorDashboardStatus = (state: RootState) =>
  state.investorDashboard.status;

export const selectInvestorDashboardError = (state: RootState) =>
  state.investorDashboard.error;
