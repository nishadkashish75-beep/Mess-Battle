import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

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

// Menu features
import StudentMenu from "./pages/student/StudentMenu";
import MealDemand from "./pages/student/MealDemand";

import StaffMenu from "./pages/staff/StaffMenu";

// Staff features
import ComplaintManagement from "./pages/staff/ComplaintManagement";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ================= STUDENT DASHBOARD ================= */}

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= STUDENT FEATURES ================= */}

        <Route
          path="/feedback"
          element={
            <ProtectedRoute allowedRole="student">
              <Feedback />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaint"
          element={
            <ProtectedRoute allowedRole="student">
              <Complaint />
            </ProtectedRoute>
          }
        />

        <Route
          path="/voting"
          element={
            <ProtectedRoute allowedRole="student">
              <Voting />
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentMenu />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meal-demand"
          element={
            <ProtectedRoute allowedRole="student">
              <MealDemand />
            </ProtectedRoute>
          }
        />

        {/* ================= STAFF DASHBOARD ================= */}

        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= STAFF FEATURES ================= */}

        <Route
          path="/staff/complaints"
          element={
            <ProtectedRoute allowedRole="staff">
              <ComplaintManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/menu"
          element={
            <ProtectedRoute allowedRole="staff">
              <StaffMenu />
            </ProtectedRoute>
          }
        />

        {/* ================= DEFAULT ================= */}

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;