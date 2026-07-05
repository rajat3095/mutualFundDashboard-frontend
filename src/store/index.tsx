import { configureStore, combineReducers } from "@reduxjs/toolkit";
import investorDashboardReducer from "./feature/InvestorDashboard/InvestorDashboardReducer";
import investorDashboardListenerMiddleware from "./feature/InvestorDashboard/InvestorDashboardMiddleware";
import investorPortfolioReducer from "./feature/InvestorPortfolio/InvestorPortfolioReducer";
import investorPortfolioListenerMiddleware from "./feature/InvestorPortfolio/InvestorPortfolioMiddleware";

const rootReducer = combineReducers({
  investorDashboard: investorDashboardReducer,
  investorPortfolio: investorPortfolioReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(
      investorDashboardListenerMiddleware.middleware,
      investorPortfolioListenerMiddleware.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
