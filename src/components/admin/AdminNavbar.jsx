import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);

      // Member 1 ke existing login page par
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">

      <div className="max-w-7xl mx-auto px-6">

        <div className="h-20 flex items-center justify-between">

          {/* =========================
              LOGO
          ========================= */}

          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                Mess Battle
              </h1>
            </div>

          </div>


          {/* =========================
              NAVIGATION
          ========================= */}

          <div className="hidden md:flex items-center gap-2">

            <NavLink
              to="/"
              className={navLinkClass}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/users"
              className={navLinkClass}
            >
              Users
            </NavLink>

            <NavLink
              to="/complaints"
              className={navLinkClass}
            >
              Complaints
            </NavLink>

            <NavLink
              to="/announcements"
              className={navLinkClass}
            >
              Announcements
            </NavLink>

            <NavLink
              to="/analytics"
              className={navLinkClass}
            >
              Analytics
            </NavLink>

          </div>


          {/* =========================
              ADMIN PROFILE
          ========================= */}

          <div className="flex items-center gap-3">

            <div className="hidden sm:block text-right">

              <p className="text-sm font-semibold text-gray-800">
                Admin
              </p>

              <p className="text-xs text-gray-400">
                Administrator
              </p>

            </div>


            {/* Logout */}

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition"
            >
              Logout
            </button>

          </div>

        </div>

      </div>

    </nav>
  );
}

export default AdminNavbar;