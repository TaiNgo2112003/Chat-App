import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { FaTasks, FaCloud, FaAddressBook, FaCompass, FaRegClock, FaCog, FaSignOutAlt, FaUserCircle } from "react-icons/fa"; // Import biểu tượng mới
import {FaRobot} from "react-icons/fa"; // Import icon AI

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">ChatNBTT</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">


            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <FaUserCircle className="size-5" /> {/* Biểu tượng hồ sơ */}
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <Link to={"/todo"} className={`btn btn-sm gap-2`}>
                  <FaTasks className="size-5" /> {/* Thay đổi icon */}
                  <span className="hidden sm:inline">To-Do</span>
                </Link>
                <Link to={"/cloud"} className={`btn btn-sm gap-2`}>
                  <FaCloud className="size-5" /> {/* Thay đổi icon */}
                  <span className="hidden sm:inline">Cloud</span>
                </Link>
                <Link to={"/contacts"} className={`btn btn-sm gap-2`}>
                  <FaAddressBook className="size-5" /> {/* Biểu tượng danh bạ */}
                  <span className="hidden sm:inline">Contacts</span>
                </Link>

                <Link to={"/discovery"} className={`btn btn-sm gap-2`}>
                  <FaCompass className="size-5" /> {/* Biểu tượng khám phá */}
                  <span className="hidden sm:inline">Discovery</span>
                </Link>

                <Link to={"/generatorimage"} className={`btn btn-sm gap-2`}>
                  <FaRobot className="size-5" /> {/* Biểu tượng AI */}
                  <span className="hidden sm:inline">AI Image</span>
                </Link>

                <Link to={"/timeline"} className={`btn btn-sm gap-2`}>
                  <FaRegClock className="size-5" /> {/* Biểu tượng dòng thời gian */}
                  <span className="hidden sm:inline">Timeline</span>
                </Link>
                <Link to={"/settings"}
                  className={`btn btn-sm gap-2 transition-colors`}>
                  <FaCog className="w-4 h-4" /> {/* Biểu tượng bánh răng */}
                  <span className="hidden sm:inline">Settings</span>
                </Link>
                <br />
                <div className="h-6 w-px bg-gray-300"></div>
                <br />

                <button className="flex gap-2 items-center" onClick={logout}>
                  <FaSignOutAlt className="size-5" /> {/* Biểu tượng đăng xuất */}
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;