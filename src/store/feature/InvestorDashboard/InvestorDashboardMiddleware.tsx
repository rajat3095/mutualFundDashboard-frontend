import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import InvestorDashboardService from "@/services/InvestorDashboard/InvestorDashboardService";
import { investorDashboardSliceActions } from "./InvestorDashboardReducer";

const investorDashboardListenerMiddleware = createListenerMiddleware();
const investorDashboardService = new InvestorDashboardService();

investorDashboardListenerMiddleware.startListening({
  matcher: isAnyOf(investorDashboardSliceActions.getInvestorListAction),
  effect: async (_action, listenerApi) => {
    try {
      const res = await investorDashboardService.getInvestorList();
      listenerApi.dispatch(
        investorDashboardSliceActions.setInvestorList(res.data),
      );
    } catch (error: unknown) {
      console.log(error);
    }
  },
});

export default investorDashboardListenerMiddleware;
