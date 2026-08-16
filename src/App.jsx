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

        {/* ================= STUDENT ROUTES ================= */}

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

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

        {/* ================= STAFF ROUTES ================= */}

        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/complaints"
          element={
            <ProtectedRoute allowedRole="staff">
              <ComplaintManagement />
            </ProtectedRoute>
          }
        />

        {/* ================= DEFAULT ROUTE ================= */}

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;