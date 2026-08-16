import { useState } from "react";

import StaffMenu from "./pages/staff/StaffMenu";
import StudentMenu from "./pages/student/StudentMenu";
import Navbar from "./components/Navbar";

function App() {
  const [page, setPage] = useState("student");

  return (
    <div>
      <Navbar page={page} setPage={setPage} />

      {page === "staff" && <StaffMenu />}

      {page === "student" && <StudentMenu />}
    </div>
  );
}

export default App;