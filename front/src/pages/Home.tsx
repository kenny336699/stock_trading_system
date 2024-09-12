import React from "react";

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
