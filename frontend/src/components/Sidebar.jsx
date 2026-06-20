import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 hidden lg:flex flex-col">

      <div className="p-6">
        <h1 className="text-3xl font-bold">
          TaskFlow
        </h1>

        <p className="text-slate-400 text-sm mt-2">
          Project Management
        </p>
      </div>

      <nav className="px-4 space-y-2">

        <button className="sidebar-btn">
          <LayoutDashboard size={20}/>
          Dashboard
        </button>

        <button className="sidebar-btn">
          <FolderKanban size={20}/>
          Projects
        </button>

        <button className="sidebar-btn">
          <CheckSquare size={20}/>
          Tasks
        </button>

        <button className="sidebar-btn">
          <Users size={20}/>
          Team
        </button>

        <button className="sidebar-btn">
          <Settings size={20}/>
          Settings
        </button>
        <button className="upgrade-btn">
          Go Pro
        </button>
        <button onClick={() => navigate("/pricing")}>
          Upgrade
        </button>

      </nav>

    </aside>
  );
}

export default Sidebar;