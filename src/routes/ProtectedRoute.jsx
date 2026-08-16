import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useSelector(
    (state) => state.auth
  );

  // ==============================
  // AUTH STATE LOADING
  // ==============================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">
          Loading...
        </p>
      </div>
    );
  }

  // ==============================
  // USER NOT LOGGED IN
  // ==============================

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ==============================
  // STAFF REQUEST PENDING
  // ==============================

  if (
    user.role === "staff" &&
    user.status === "pending"
  ) {
    return (
      <Navigate
        to="/access-pending"
        replace
      />
    );
  }

  // ==============================
  // STAFF REQUEST REJECTED
  // ==============================

  if (
    user.role === "staff" &&
    user.status === "rejected"
  ) {
    return (
      <Navigate
        to="/access-denied"
        replace
      />
    );
  }

  // ==============================
  // ROLE NOT ALLOWED
  // ==============================

  if (user.role !== allowedRole) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  // ==============================
  // ACCESS ALLOWED
  // ==============================

  return children;
}

export default ProtectedRoute;