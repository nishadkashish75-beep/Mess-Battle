import { useState } from "react";

import StaffMenu from "./pages/staff/StaffMenu";
import StudentMenu from "./pages/student/StudentMenu";


function App() {

  const [page, setPage] = useState("student");


  return (
    <div>

      <h1>
        Mess Battle
      </h1>


      {/* ========================================= */}
      {/* NAVIGATION - TEMPORARY FOR TESTING */}
      {/* ========================================= */}

      <div>

        <button
          onClick={() => setPage("staff")}
        >
          Staff
        </button>


        {" "}


        <button
          onClick={() => setPage("student")}
        >
          Student
        </button>

      </div>


      <hr />


      {/* ========================================= */}
      {/* STAFF PAGE */}
      {/* ========================================= */}

      {page === "staff" && (
        <StaffMenu />
      )}


      {/* ========================================= */}
      {/* STUDENT PAGE */}
      {/* ========================================= */}

      {page === "student" && (
        <StudentMenu />
      )}

    </div>
  );
}


export default App;