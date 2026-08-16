import { useSelector } from "react-redux";

function StaffDashboard() {

  const user = useSelector(
    (state) => state.auth.user
  );

  return (
    <div className="min-h-screen bg-green-50 p-10">

      <h1 className="text-4xl font-bold text-green-700">
        Staff Dashboard
      </h1>

      <p className="mt-4 text-xl">
        Welcome, {user?.name}
      </p>

      <p className="mt-2">
        Role: {user?.role}
      </p>

    </div>
  );
}

export default StaffDashboard;