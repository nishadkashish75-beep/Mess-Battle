import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationRequests from "./components/admin/RegistrationRequests";
import AdminNavbar from "./components/admin/AdminNavbar";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import ComplaintManagement from "./pages/admin/ComplaintManagement";
import RegistrationManagement from "./pages/admin/RegistrationManagement";
import AnnouncementManagement from "./pages/admin/AnnouncementManagement";
import Analytics from "./pages/admin/Analytics";

function App() {
  return (
    <BrowserRouter>

      {/* Admin Navbar */}
      <AdminNavbar />

      <Routes>

        {/* ================= DASHBOARD ================= */}
        <Route
          path="/"
          element={<AdminDashboard />}
        />

        {/* ================= USERS ================= */}
        <Route
          path="/users"
          element={<UserManagement />}
        />

        {/* ================= REGISTRATION MANAGEMENT ================= */}
        <Route
          path="/admin/registration-requests"
          element={<RegistrationManagement />}
        />

        {/* ================= COMPLAINTS ================= */}
        <Route
          path="/complaints"
          element={<ComplaintManagement />}
        />

        {/* ================= ANNOUNCEMENTS ================= */}
        <Route
          path="/announcements"
          element={<AnnouncementManagement />}
        />

        {/* ================= ANALYTICS ================= */}
        <Route
          path="/analytics"
          element={<Analytics />}
        />
        <Route
          path="/admin/registration-requests"
          element={<RegistrationRequests />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;