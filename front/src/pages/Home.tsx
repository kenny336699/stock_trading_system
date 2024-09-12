import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../store";
import StockList from "@/components/StockList";
import UserProfile from "@/components/Profile";

const Home: React.FC = () => {
  return (
    <div>
      <StockList />
      <UserProfile />
    </div>
  );
};

export default Home;
