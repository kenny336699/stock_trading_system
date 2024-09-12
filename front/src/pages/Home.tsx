import React, { useEffect } from "react";

import StockList from "@/components/StockList";
import UserProfile from "@/components/Profile";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import { fetchAllStocks, fetchUserStocks } from "@/store/stockSlice";

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(
    (state: RootState) => state.user.currentUser
  );

  useEffect(() => {
    dispatch(fetchAllStocks());
    if (currentUser) {
      dispatch(fetchUserStocks(currentUser.id));
    }
  }, [dispatch, currentUser]);
  return (
    <div>
      <StockList />
      <UserProfile />
    </div>
  );
};

export default Home;
