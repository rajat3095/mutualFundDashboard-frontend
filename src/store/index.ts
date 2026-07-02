import { configureStore } from "@reduxjs/toolkit";
import investorReducer from "./investorSlice";

export const store = configureStore({
  reducer: {
    investors: investorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
