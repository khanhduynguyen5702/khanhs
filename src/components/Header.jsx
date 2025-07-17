import { NavLink, useNavigate } from "react-router-dom";
import { useStore } from "./Zustand";
import { Search, LogOut, LogIn, UserPlus, Home, Store } from "lucide-react";
import { useState, useRef } from "react";
import { UnverifiedIcon } from "@primer/octicons-react";
import { FaPeopleGroup } from "react-icons/fa6";
import axios from "axios";
import Notification from "./Notification";

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, username, logout, role, triggerRefetchNoti, setTriggerRefetchNoti } = useStore();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const handleLogout = () => {
      logout();
      navigate("/login");
    };
  const API = axios.create({
    baseURL: "https://haicode.fcstoys.cloud/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4 w-1/3">
          <NavLink to="/" className="text-black-600 text-2xl font-bold">
            Social Media
          </NavLink>
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full bg-gray-100 px-4 py-2 rounded-full pl-10 focus:outline-none"
            />
            <Search size={16} className="absolute top-2.5 left-3 text-gray-500" />
          </div>
        </div>

        <div className="flex items-center gap-6 justify-center w-1/3">
          <NavLink to="/" className="text-gray-600 hover:text-blue-600">
            <Home size={30} />
          </NavLink>
          <NavLink to="/groups" className="text-gray-600 hover:text-blue-600">
            <FaPeopleGroup size={30} />
          </NavLink>
          <NavLink to="/Store" className="text-gray-600 hover:text-blue-600">
            <Store size={30} />
          </NavLink>
        </div>

        <div className="flex items-center gap-4 justify-end w-1/3">
          {isLoggedIn ? (
            <>
              <span className="text-gray-700">
                👋 <strong>{username}</strong>
              </span>

              <Notification/>

              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white text-lg font-bold cursor-pointer"
                >
                  {username?.charAt(0).toUpperCase() || "U"}
                </div>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-md border z-50">
                    <ul className="py-2 text-sm text-gray-700">
                      <NavLink to="/userin4">
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          👤 <strong>{username}</strong>
                        </li>
                      </NavLink>

                      {role === "admin" && (
                        <NavLink to="/admin">
                          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600">
                            🛠️ Trang Admin
                          </li>
                        </NavLink>
                      )}
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        ⚙️ Cài đặt tài khoản
                      </li>
                      <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <UnverifiedIcon size={15} /> Trợ giúp
                      </li>
                      <NavLink to="/changepass">
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          🔐 Đổi mật khẩu
                        </li>
                      </NavLink>
                    </ul>
                    <div
                      onClick={handleLogout}
                      className="flex items-center gap-1 text-black px-3 py-1 rounded hover:bg-gray-400"
                    >
                      <LogOut size={16} /> <span>Logout</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className="flex items-center gap-1 text-blue-600 hover:underline">
                <LogIn size={16} /> Login
              </NavLink>
              <NavLink to="/signup" className="flex items-center gap-1 text-blue-600 hover:underline">
                <UserPlus size={16} /> Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
