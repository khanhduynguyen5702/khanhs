import { NavLink } from "react-router-dom";
import { useStore } from "./Zustand";
import { Users, Clock, Store } from "lucide-react";
import { FaPeopleGroup } from "react-icons/fa6";

function Sidebar() {
  const username = useStore((state) => state.username);

  const navItems = [
    { name: "Friends", path: "/friends", icon: <Users size={20} /> },
    { name: "Groups", path: "/groups", icon: <FaPeopleGroup size={20} /> },
    { name: "Memories", path: "/memories", icon: <Clock size={20} /> },
    { name: "Store", path: "/store", icon: <Store size={20} /> },
  ];

  return (
    <aside className="w-60 p-4 bg-white shadow h-full sticky top-16 hidden md:block">
      <div className="mb-6">
        <NavLink
          to="/userin4"
          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition"
        >
          <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white text-lg font-bold">
            {username?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="text-gray-800 font-semibold">{username || "User"}</div>
        </NavLink>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
