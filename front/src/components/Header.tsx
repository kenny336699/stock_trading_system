import { useEffect, useState } from "react";
import { LogOut, LogIn, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import logo1 from "../assets/logo1.png";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/userSlice";
import { adminLogout } from "@/store/adminSlice";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const currentAdmin = useSelector(
    (state: RootState) => state.admin.currentAdmin
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    if (currentAdmin) {
      dispatch(adminLogout());
      navigate("/admin");
    } else if (currentUser) {
      dispatch(logout());
      navigate("/");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const renderAuthContent = () => {
    if (currentAdmin) {
      return (
        <>
          <span className="text-sm font-medium">
            Admin: {currentAdmin.username}
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
      );
    } else if (currentUser) {
      return (
        <>
          <span className="text-sm font-medium">
            User: {currentUser.full_name}
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
      );
    } else {
      return (
        <Link to="/auth">
          <Button variant="ghost" size="sm" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            User Login
          </Button>
        </Link>
      );
    }
  };

  return (
    <header
      className={`bg-pink-300 p-4 transition-all duration-300 ${
        isSticky ? "sticky top-0 z-50 shadow-md" : ""
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={logo1} alt="Toronto Cupcake" className="w-12 h-12" />
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {/* Add your navigation items here */}
            </ul>
          </nav>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {renderAuthContent()}
        </div>
        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <nav>
            <ul className="flex flex-col space-y-2">
              {/* Add your navigation items here */}
            </ul>
          </nav>
          <div className="mt-4 flex flex-col space-y-2">
            {renderAuthContent()}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
