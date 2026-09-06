import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const username =
    localStorage.getItem("medipath_username") || "Health Worker";

  const handleLogout = () => {
    localStorage.removeItem("medipath_logged_in");
    localStorage.removeItem("medipath_username");
    localStorage.removeItem("medipath_role");
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-[#dfeae7] h-[73px] flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-50 shadow-sm">

      {/* Logo */}

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0f766e] flex items-center justify-center shadow-sm">
          <span className="text-xl sm:text-2xl">
            🏥
          </span>
        </div>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#123c3a] tracking-tight">
            MediPath
          </h1>

          <p className="hidden sm:block text-xs text-slate-500">
            Rural Healthcare Portal
          </p>
        </div>

      </div>


      {/* Right Side */}

      <div className="flex items-center gap-2 sm:gap-4">

        {/* Demo Mode */}

        <div className="hidden sm:flex items-center gap-2 bg-[#f0fdfa] border border-[#99f6e4] px-3 py-2 rounded-full">

          <span className="relative flex h-2.5 w-2.5">

            <span className="absolute inline-flex h-full w-full rounded-full bg-[#2dd4bf] opacity-60 animate-ping"></span>

            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#14b8a6]"></span>

          </span>

          <span className="text-xs font-bold text-[#0f766e] tracking-wide">
            DEMO MODE
          </span>

        </div>


        {/* User */}

        <div className="flex items-center gap-2 sm:gap-3">

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#ccfbf1] border-2 border-[#99f6e4] flex items-center justify-center text-[#0f766e] font-bold">
            {username.charAt(0).toUpperCase()}
          </div>

          <div className="hidden md:block">

            <p className="text-sm font-semibold text-[#173330]">
              {username}
            </p>

            <p className="text-xs text-slate-500">
              Health Worker
            </p>

          </div>

        </div>


        {/* Logout */}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 border border-[#dfeae7] hover:border-red-200 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
        >

          <span>
            🚪
          </span>

          <span className="hidden sm:inline">
            Logout
          </span>

        </button>

      </div>

    </header>
  );
}

export default Navbar;