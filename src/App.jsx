import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Feedback from "./pages/student/Feedback";
import Complaint from "./pages/student/Complaint";
import Voting from "./pages/student/Voting";
import ComplaintManagement from "./pages/staff/ComplaintManagement";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Student Routes */}
        <Route
          path="/feedback"
          element={<Feedback />}
        />

        <Route
          path="/complaint"
          element={<Complaint />}
        />

        <Route
          path="/voting"
          element={<Voting />}
        />

        {/* Staff Route */}
        <Route
          path="/staff/complaints"
          element={<ComplaintManagement />}
        />

        {/* Default Route */}
        <Route
          path="*"
          element={<Feedback />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;