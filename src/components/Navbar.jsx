function Navbar({ page, setPage }) {
  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold text-orange-600">
            🍽️ Mess Battle
          </h1>

          <p className="text-xs text-gray-500">
            Smart Mess Management
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">

          {/* Student */}
          <button
            onClick={() => setPage("student")}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              page === "student"
                ? "bg-orange-500 text-white"
                : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            🎓 Student
          </button>

          {/* Staff */}
          <button
            onClick={() => setPage("staff")}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              page === "staff"
                ? "bg-orange-500 text-white"
                : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            👨‍🍳 Staff
          </button>

        

        </div>
      </div>
    </nav>
  );
}

export default Navbar;