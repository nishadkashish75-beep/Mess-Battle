import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) =>
    `rounded-lg px-4 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-indigo-600 text-white shadow-md"
        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        
        {/* Logo */}
        <NavLink to="/student" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-lg">
            🍽️
          </span>

          <span className="text-lg font-extrabold text-gray-900">
            Mess Battle
          </span>
        </NavLink>

        {/* Navigation */}
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <NavLink to="/student" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/feedback" className={linkClass}>
            Feedback
          </NavLink>

          <NavLink to="/complaint" className={linkClass}>
            Complaints
          </NavLink>

          <NavLink to="/voting" className={linkClass}>
            Voting
          </NavLink>

          <NavLink to="/menu" className={linkClass}>
            Menu
          </NavLink>

          <NavLink to="/meal-demand" className={linkClass}>
            Meal Demand
          </NavLink>

          <NavLink to="/staff" className={linkClass}>
            Staff
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;