function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">

      <h1 className="text-5xl font-bold text-red-600">
        Access Denied
      </h1>

      <p className="mt-4 text-lg">
        You are not authorized to access this page.
      </p>

    </div>
  );
}

export default Unauthorized;