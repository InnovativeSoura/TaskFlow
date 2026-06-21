import { Bell, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">

      <div className="flex items-center gap-4">

        <img
          src={logo}
          alt="TaskFlow Logo"
          className="w-10 h-10"
        />

        <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-xl">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search projects..."
            className="bg-transparent outline-none"
          />
        </div>

      </div>

      <div className="flex items-center gap-5">

        <Bell className="cursor-pointer" />

        <img
          src={
            user?.profileImage ||
            "https://ui-avatars.com/api/?name=User"
          }
          alt="profile"
          className="w-10 h-10 rounded-full object-cover border border-slate-700"
        />

      </div>

    </header>
  );
}

export default Navbar;