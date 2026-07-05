import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import InvestorPortfolioService from "@/services/InvestorPortfolio/InvestorPortfolioService";
import { investorPortfolioSliceActions } from "./InvestorPortfolioReducer";

const investorPortfolioListenerMiddleware = createListenerMiddleware();
const investorPortfolioService = new InvestorPortfolioService();

investorPortfolioListenerMiddleware.startListening({
  matcher: isAnyOf(
    investorPortfolioSliceActions.getInvestorPortfolioListAction,
  ),
  effect: async (
    action: ReturnType<
      typeof investorPortfolioSliceActions.getInvestorPortfolioListAction
    >,
    listenerApi,
  ) => {
    try {
      const res =
        await investorPortfolioService.getInvestorPortfolioSchemeWiseHoldings(
          action.payload,
        );
      listenerApi.dispatch(
        investorPortfolioSliceActions.setInvestorPortfolioList(res.data),
      );
    } catch (error: unknown) {
      console.log(error);
    }
  },
});

export default investorPortfolioListenerMiddleware;
