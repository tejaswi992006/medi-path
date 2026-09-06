import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "🏠",
    },
    {
      name: "Register Patient",
      path: "/patients/register",
      icon: "➕",
    },
    {
      name: "Search Patient",
      path: "/patients/search",
      icon: "🔍",
    },
    {
      name: "Triage",
      path: "/triage",
      icon: "🩺",
    },
    {
      name: "Referral",
      path: "/referral",
      icon: "🏥",
    },
    {
      name: "Follow-ups",
      path: "/followups",
      icon: "📅",
    },
  ];

  return (
    <aside className="hidden md:flex w-64 min-h-[calc(100vh-73px)] bg-[#123c3a] text-white flex-col border-r border-[#0d302e]">

      {/* =================================
          BRAND
      ================================= */}

      <div className="px-5 py-6 border-b border-white/10">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-md">
            <span className="text-2xl">🏥</span>
          </div>

          <div>
            <h2 className="text-lg font-bold tracking-tight">
              MediPath
            </h2>

            <p className="text-xs text-teal-200">
              Rural Healthcare
            </p>
          </div>

        </div>

      </div>


      {/* =================================
          SECTION TITLE
      ================================= */}

      <div className="px-5 pt-6 pb-3">

        <p className="text-[11px] uppercase tracking-[0.12em] text-teal-300 font-bold">
          Health Worker Portal
        </p>

      </div>


      {/* =================================
          NAVIGATION
      ================================= */}

      <nav className="px-3 space-y-1">

        {menuItems.map((item) => (

          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-[#0f766e] text-white shadow-md"
                  : "text-teal-50/90 hover:bg-white/10 hover:text-white"
              }`
            }
          >

            <span className="w-8 text-center text-lg shrink-0">
              {item.icon}
            </span>

            <span className="font-semibold text-sm">
              {item.name}
            </span>

          </NavLink>

        ))}

      </nav>


      {/* =================================
          DEMO MODE
      ================================= */}

      <div className="mx-4 mt-7 p-4 rounded-xl bg-[#0f4f4b] border border-teal-400/20">

        <div className="flex items-center gap-2">

          <span className="relative flex h-2.5 w-2.5">

            <span className="absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-60 animate-ping"></span>

            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-300"></span>

          </span>

          <span className="text-xs font-bold text-teal-100 tracking-wide">
            DEMO MODE
          </span>

        </div>

        <p className="text-xs text-teal-200/80 mt-2 leading-relaxed">
          Currently using sample patient data.
        </p>

      </div>


      {/* =================================
          SPACER
      ================================= */}

      <div className="flex-1"></div>


      {/* =================================
          LOGOUT
      ================================= */}

      <div className="p-4 border-t border-white/10">

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("medipath_logged_in");
            localStorage.removeItem("medipath_username");
            localStorage.removeItem("medipath_role");

            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-teal-50/90 hover:bg-red-500/20 hover:text-white transition-all duration-200"
        >

          <span className="text-lg">
            🚪
          </span>

          <span className="font-semibold text-sm">
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;