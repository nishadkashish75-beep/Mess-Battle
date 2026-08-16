import { Link } from "react-router-dom";

function StudentDashboard() {
  const features = [
    {
      title: "Meal Feedback",
      description: "Rate your meals and share your experience.",
      icon: "⭐",
      path: "/feedback",
      style: "from-yellow-400 to-orange-500",
    },
    {
      title: "Complaints",
      description: "Report food, hygiene, timing, or other issues.",
      icon: "🚨",
      path: "/complaints",
      style: "from-red-500 to-orange-500",
    },
    {
      title: "Special Meal Voting",
      description: "Vote for the special meal you want.",
      icon: "🗳️",
      path: "/voting",
      style: "from-indigo-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10 text-center">

          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-4xl shadow-xl shadow-indigo-200">
            🍽️
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Welcome to Mess Battle
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-base text-gray-500 sm:text-lg">
            Manage your meals, share feedback, report
            issues, and vote for special meals.
          </p>

        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-3">

          {features.map((feature) => (
            <Link
              key={feature.path}
              to={feature.path}
              className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.style} text-2xl shadow-lg`}
              >
                {feature.icon}
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                {feature.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {feature.description}
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-indigo-600">
                Open
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>

            </Link>
          ))}

        </div>

        {/* Quick Info */}
        <div className="mt-8 rounded-3xl border border-indigo-100 bg-indigo-50 p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
              💡
            </div>

            <div>
              <h3 className="font-bold text-gray-900">
                Your voice matters!
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Your feedback and complaints help the mess
                team improve the food and overall experience.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;