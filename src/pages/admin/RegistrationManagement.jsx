function RegistrationManagement() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800">
          Registration Requests
        </h1>

        <p className="text-gray-500 mt-2">
          Manage new user and staff registration requests.
        </p>

        <div className="bg-white rounded-xl shadow-sm mt-6 p-6">

          <p className="text-gray-600">
            No pending registration requests.
          </p>

        </div>

      </div>

    </div>
  );
}

export default RegistrationManagement;