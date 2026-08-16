import { BrowserRouter, Routes, Route,} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Public */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />



        {/* Unauthorized */}

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />


      </Routes>

    </BrowserRouter>
  );
}

export default App;