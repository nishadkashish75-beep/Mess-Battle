import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/admin/AdminNavbar";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";

// Protected route
import ProtectedRoute from "./routes/ProtectedRoute";

// Dashboards
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";

// Student features
import Feedback from "./pages/student/Feedback";
import Complaint from "./pages/student/Complaint";
import Voting from "./pages/student/Voting";
import StudentMenu from "./pages/student/StudentMenu";
import MealDemand from "./pages/student/MealDemand";

// Staff features
import StaffMenu from "./pages/staff/StaffMenu";
import StaffComplaintManagement from "./pages/staff/ComplaintManagement";

// Admin features
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AdminComplaintManagement from "./pages/admin/ComplaintManagement";
import RegistrationManagement from "./pages/admin/RegistrationManagement";
import AnnouncementManagement from "./pages/admin/AnnouncementManagement";
import Analytics from "./pages/admin/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/unauthorized" element={<Unauthorized />} />


        {/* ================= STUDENT AREA ================= */}

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <>
                <Navbar />
                <StudentDashboard />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback"
          element={
            <ProtectedRoute allowedRole="student">
              <>
                <Navbar />
                <Feedback />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaint"
          element={
            <ProtectedRoute allowedRole="student">
              <>
                <Navbar />
                <Complaint />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/voting"
          element={
            <ProtectedRoute allowedRole="student">
              <>
                <Navbar />
                <Voting />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu"
          element={
            <ProtectedRoute allowedRole="student">
              <>
                <Navbar />
                <StudentMenu />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/meal-demand"
          element={
            <ProtectedRoute allowedRole="student">
              <>
                <Navbar />
                <MealDemand />
              </>
            </ProtectedRoute>
          }
        />


        {/* ================= STAFF AREA ================= */}

        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRole="staff">
              <>
                <Navbar />
                <StaffDashboard />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/menu"
          element={
            <ProtectedRoute allowedRole="staff">
              <>
                <Navbar />
                <StaffMenu />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/complaints"
          element={
            <ProtectedRoute allowedRole="staff">
              <>
                <Navbar />
                <StaffComplaintManagement />
              </>
            </ProtectedRoute>
          }
        />


        {/* ================= ADMIN AREA ================= */}

        <Route
          path="/admin"
          element={
            <>
              <AdminNavbar />
              <AdminDashboard />
            </>
          }
        />

        <Route
          path="/users"
          element={
            <>
              <AdminNavbar />
              <UserManagement />
            </>
          }
        />

        <Route
          path="/admin/registration-requests"
          element={
            <>
              <AdminNavbar />
              <RegistrationManagement />
            </>
          }
        />

        <Route
          path="/complaints"
          element={
            <>
              <AdminNavbar />
              <AdminComplaintManagement />
            </>
          }
        />

        <Route
          path="/announcements"
          element={
            <>
              <AdminNavbar />
              <AnnouncementManagement />
            </>
          }
        />

        <Route
          path="/analytics"
          element={
            <>
              <AdminNavbar />
              <Analytics />
            </>
          }
        />


        {/* ================= DEFAULT ================= */}

        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;