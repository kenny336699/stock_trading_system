import React, { useEffect } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

import Header from "./components/Header";
import { useAppDispatch } from "./store/hooks";
import { initializeAuth } from "./util/authUtils";
import Auth from "./pages/Auth";

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    initializeAuth(dispatch);
  }, [dispatch]);
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
