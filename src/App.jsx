import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminNavbar from "./components/admin/AdminNavbar";
import RegistrationRequests from "./components/admin/RegistrationRequests";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import ComplaintManagement from "./pages/admin/ComplaintManagement";
import AnnouncementManagement from "./pages/admin/AnnouncementManagement";
import Analytics from "./pages/admin/Analytics";

function App() {
  return (
    <BrowserRouter>
      <AdminNavbar />

      <Routes>

        <Route
          path="/"
          element={<AdminDashboard />}
        />

        <Route
          path="/users"
          element={<UserManagement />}
        />

        <Route
          path="/admin/registration-requests"
          element={<RegistrationRequests />}
        />

        <Route
          path="/complaints"
          element={<ComplaintManagement />}
        />

        <Route
          path="/announcements"
          element={<AnnouncementManagement />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;