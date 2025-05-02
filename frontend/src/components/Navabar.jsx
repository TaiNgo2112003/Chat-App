import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare } from "lucide-react";
import { FaTasks, FaCloud, FaAddressBook, FaCompass, FaRegClock, FaCog, FaSignOutAlt, FaUserCircle, FaRobot } from "react-icons/fa";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`fixed w-full top-0 z-40 backdrop-blur-lg transition-all duration-300 ${
        isScrolled ? "bg-base-100/90 border-b border-base-300 shadow-sm" : "bg-base-100/80"
      }`}
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo/Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold hidden sm:inline">TaiNexus 🔥</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {authUser && (
              <>
                <NavItem to="/profile" icon={<FaUserCircle className="size-5" />} text="Profile" />
                <NavItem to="/todo" icon={<FaTasks className="size-5" />} text="To-Do" />
                <NavItem to="/cloud" icon={<FaCloud className="size-5" />} text="Cloud" />
                <NavItem to="/contacts" icon={<FaAddressBook className="size-5" />} text="Contacts" />
                <NavItem to="/discovery" icon={<FaCompass className="size-5" />} text="Discovery" />
                <NavItem to="/generatorimage" icon={<FaRobot className="size-5" />} text="AI Image" />
                <NavItem to="/timeline" icon={<FaRegClock className="size-5" />} text="Timeline" />
                <NavItem to="/settings" icon={<FaCog className="size-5" />} text="Settings" />
                <div className="h-6 w-px bg-gray-300 mx-1"></div>
                <button 
                  onClick={logout}
                  className="btn btn-sm gap-2 hover:bg-error/10 hover:text-error transition-colors"
                >
                  <FaSignOutAlt className="size-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          {authUser && (
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md hover:bg-base-200 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <HiX className="w-6 h-6" />
                ) : (
                  <HiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && authUser && (
          <div className="md:hidden bg-base-100 border-t border-base-300 pb-4">
            <div className="flex flex-col space-y-2 px-4 pt-4">
              <MobileNavItem to="/profile" icon={<FaUserCircle className="size-5" />} text="Profile" />
              <MobileNavItem to="/todo" icon={<FaTasks className="size-5" />} text="To-Do" />
              <MobileNavItem to="/cloud" icon={<FaCloud className="size-5" />} text="Cloud" />
              <MobileNavItem to="/contacts" icon={<FaAddressBook className="size-5" />} text="Contacts" />
              <MobileNavItem to="/discovery" icon={<FaCompass className="size-5" />} text="Discovery" />
              <MobileNavItem to="/generatorimage" icon={<FaRobot className="size-5" />} text="AI Image" />
              <MobileNavItem to="/timeline" icon={<FaRegClock className="size-5" />} text="Timeline" />
              <MobileNavItem to="/settings" icon={<FaCog className="size-5" />} text="Settings" />
              <div className="h-px bg-gray-300 my-2"></div>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-error/10 hover:text-error transition-colors"
              >
                <FaSignOutAlt className="size-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Reusable Nav Item Component for Desktop
const NavItem = ({ to, icon, text }) => (
  <Link to={to} className="btn btn-sm gap-2 hover:bg-primary/10 hover:text-primary transition-colors">
    {icon}
    <span>{text}</span>
  </Link>
);

// Reusable Nav Item Component for Mobile
const MobileNavItem = ({ to, icon, text }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navbar;