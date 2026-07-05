import { RootState } from "@/store/index";

export const selectInvestorPortfolio = (state: RootState) =>
  state.investorPortfolio.portfolioList;

export const selectInvestorPortfolioStatus = (state: RootState) =>
  state.investorPortfolio.status;

export const selectInvestorPortfolioError = (state: RootState) =>
  state.investorPortfolio.error;
