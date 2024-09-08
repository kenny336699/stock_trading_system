import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

import logo1 from "../assets/logo1.png";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/userSlice"; // Adjust this import path as needed

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header
      className={`bg-pink-300 p-4 transition-all duration-300 ${
        isSticky ? "sticky top-0 z-50 shadow-md" : ""
      }`}
    >
      <div className="w-full px-40 mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={logo1} alt="Toronto Cupcake" className="w-12 h-12" />
          <nav>
            <ul className="flex space-x-6"></ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {currentUser && (
            <>
              <span className="text-sm font-medium">
                Welcome, {currentUser.full_name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
