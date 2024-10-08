import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import stockReducer from "./stockSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    stock: stockReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
