import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import stockReducer from "./stockSlice";
import adminReducer from "./adminSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    stock: stockReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
