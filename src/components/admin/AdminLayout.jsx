import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}

      <AdminNavbar />

      {/* Page Content */}

      <main>
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;