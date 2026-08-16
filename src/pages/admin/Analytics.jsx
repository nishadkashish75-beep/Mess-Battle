import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

function Analytics() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalComplaints, setTotalComplaints] = useState(0);

  const [pending, setPending] = useState(0);
  const [inProgress, setInProgress] = useState(0);
  const [resolved, setResolved] = useState(0);

  const [averageRating, setAverageRating] = useState("0.0");

  // Meal Demand
  const [breakfastDemand, setBreakfastDemand] = useState(0);
  const [lunchDemand, setLunchDemand] = useState(0);
  const [dinnerDemand, setDinnerDemand] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // =========================
        // USERS
        // =========================

        const usersSnapshot = await getDocs(
          collection(db, "users")
        );

        setTotalUsers(usersSnapshot.size);

        // =========================
        // STAFF
        // =========================

        const staffSnapshot = await getDocs(
          collection(db, "staff")
        );

        setTotalStaff(staffSnapshot.size);

        // =========================
        // COMPLAINTS
        // =========================

        const complaintsSnapshot = await getDocs(
          collection(db, "complaints")
        );

        setTotalComplaints(complaintsSnapshot.size);

        let pendingCount = 0;
        let inProgressCount = 0;
        let resolvedCount = 0;

        complaintsSnapshot.forEach((item) => {
          const data = item.data();

          const status = data.status
            ? data.status.toLowerCase().trim()
            : "";

          if (status === "pending") {
            pendingCount++;
          }

          if (
            status === "in progress" ||
            status === "in-progress"
          ) {
            inProgressCount++;
          }

          if (status === "resolved") {
            resolvedCount++;
          }
        });

        setPending(pendingCount);
        setInProgress(inProgressCount);
        setResolved(resolvedCount);

        // =========================
        // RATINGS
        // =========================

        const feedbackSnapshot = await getDocs(
          collection(db, "feedback")
        );

        let totalRating = 0;
        let ratingCount = 0;

        feedbackSnapshot.forEach((item) => {
          const data = item.data();

          if (
            data.rating !== undefined &&
            data.rating !== null
          ) {
            totalRating += Number(data.rating);
            ratingCount++;
          }
        });

        if (ratingCount > 0) {
          setAverageRating(
            (totalRating / ratingCount).toFixed(1)
          );
        } else {
          setAverageRating("0.0");
        }

        // =========================
        // MEAL DEMAND
        // =========================

        const mealDemandSnapshot = await getDocs(
          collection(db, "mealAttendance")
        );

        let breakfast = 0;
        let lunch = 0;
        let dinner = 0;

        mealDemandSnapshot.forEach((item) => {
          const data = item.data();

          const mealType = data.mealType
            ? data.mealType.toLowerCase().trim()
            : "";

          const response = data.response
            ? data.response.toLowerCase().trim()
            : "";

          // Count only students who selected YES
          if (response === "yes") {
            if (mealType === "breakfast") {
              breakfast++;
            }

            if (mealType === "lunch") {
              lunch++;
            }

            if (mealType === "dinner") {
              dinner++;
            }
          }
        });

        setBreakfastDemand(breakfast);
        setLunchDemand(lunch);
        setDinnerDemand(dinner);

      } catch (error) {
        console.error(
          "Error fetching analytics:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // =========================
  // COMPLAINT PERCENTAGES
  // =========================

  const pendingPercentage =
    totalComplaints > 0
      ? Math.round(
          (pending / totalComplaints) * 100
        )
      : 0;

  const inProgressPercentage =
    totalComplaints > 0
      ? Math.round(
          (inProgress / totalComplaints) * 100
        )
      : 0;

  const resolvedPercentage =
    totalComplaints > 0
      ? Math.round(
          (resolved / totalComplaints) * 100
        )
      : 0;

  const activeComplaints = pending + inProgress;

  const totalMealDemand =
    breakfastDemand +
    lunchDemand +
    dinnerDemand;

  return (
    <div className="min-h-screen bg-[#f6f7fb]">

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">

          <div>

            <p className="text-xs font-semibold tracking-[0.2em] text-violet-600 uppercase">
              Performance Center
            </p>

            <h1 className="text-3xl font-bold text-slate-900 mt-2">
              Analytics
            </h1>

            <p className="text-slate-500 mt-2">
              A detailed view of your mess management performance.
            </p>

          </div>

          {/* RATING */}

          <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-slate-100">

            <p className="text-xs text-slate-400 uppercase tracking-wide">
              Average Rating
            </p>

            <div className="flex items-end gap-2 mt-1">

              <span className="text-3xl font-bold text-slate-900">
                {averageRating}
              </span>

              <span className="text-sm text-slate-400 mb-1">
                / 5
              </span>

            </div>

          </div>

        </div>

        {loading ? (

          <div className="bg-white rounded-2xl p-14 text-center">

            <div className="w-8 h-8 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin mx-auto">
            </div>

            <p className="text-slate-500 mt-4">
              Loading analytics...
            </p>

          </div>

        ) : (

          <>

            {/* =========================
                TOP STAT CARDS
            ========================= */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">

                <div className="absolute right-0 top-0 w-24 h-24 bg-cyan-200 rounded-bl-full">
                </div>

                <p className="text-sm text-slate-500">
                  Registered Users
                </p>

                <p className="text-4xl font-bold text-slate-900 mt-3">
                  {totalUsers}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  Total users in the system
                </p>

              </div>


              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">

                <div className="absolute right-0 top-0 w-24 h-24 bg-violet-200 rounded-bl-full">
                </div>

                <p className="text-sm text-slate-500">
                  Staff Members
                </p>

                <p className="text-4xl font-bold text-slate-900 mt-3">
                  {totalStaff}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  Staff currently registered
                </p>

              </div>


              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">

                <div className="absolute right-0 top-0 w-24 h-24 bg-pink-200 rounded-bl-full">
                </div>

                <p className="text-sm text-slate-500">
                  Total Complaints
                </p>

                <p className="text-4xl font-bold text-slate-900 mt-3">
                  {totalComplaints}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  Complaints received
                </p>

              </div>

            </div>


            {/* =========================
                MEAL DEMAND ANALYTICS
            ========================= */}

            <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100 mb-6">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                  <p className="text-xs font-semibold tracking-[0.15em] text-cyan-600 uppercase">
                    Meal Statistics
                  </p>

                  <h2 className="text-xl font-semibold text-slate-900 mt-1">
                    Meal Demand Analytics
                  </h2>

                  <p className="text-sm text-slate-400 mt-1">
                    Student meal demand based on responses
                  </p>

                </div>

                <div className="bg-cyan-200 rounded-xl px-5 py-3">

                  <p className="text-xs text-cyan-700">
                    Total Demand
                  </p>

                  <p className="text-2xl font-bold text-cyan-800">
                    {totalMealDemand}
                  </p>

                </div>

              </div>


              {/* MEAL CARDS */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-7">

                {/* BREAKFAST */}

                <div className="bg-amber-100 rounded-2xl p-5">

                  <div className="flex justify-between items-start">

                    <div>

                      <p className="text-sm font-medium text-amber-800">
                        Breakfast
                      </p>

                      <p className="text-xs text-amber-600 mt-1">
                        Student demand
                      </p>

                    </div>

                    <div className="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center">

                      <div className="w-4 h-4 bg-amber-600 rounded-full">
                      </div>

                    </div>

                  </div>

                  <p className="text-4xl font-bold text-amber-800 mt-5">
                    {breakfastDemand}
                  </p>

                  <p className="text-xs text-amber-600 mt-1">
                    students expected
                  </p>

                </div>


                {/* LUNCH */}

                <div className="bg-cyan-100 rounded-2xl p-5">

                  <div className="flex justify-between items-start">

                    <div>

                      <p className="text-sm font-medium text-cyan-800">
                        Lunch
                      </p>

                      <p className="text-xs text-cyan-600 mt-1">
                        Student demand
                      </p>

                    </div>

                    <div className="w-10 h-10 bg-cyan-200 rounded-xl flex items-center justify-center">

                      <div className="w-4 h-4 bg-cyan-600 rounded-full">
                      </div>

                    </div>

                  </div>

                  <p className="text-4xl font-bold text-cyan-800 mt-5">
                    {lunchDemand}
                  </p>

                  <p className="text-xs text-cyan-600 mt-1">
                    students expected
                  </p>

                </div>


                {/* DINNER */}

                <div className="bg-violet-100 rounded-2xl p-5">

                  <div className="flex justify-between items-start">

                    <div>

                      <p className="text-sm font-medium text-violet-800">
                        Dinner
                      </p>

                      <p className="text-xs text-violet-600 mt-1">
                        Student demand
                      </p>

                    </div>

                    <div className="w-10 h-10 bg-violet-200 rounded-xl flex items-center justify-center">

                      <div className="w-4 h-4 bg-violet-600 rounded-full">
                      </div>

                    </div>

                  </div>

                  <p className="text-4xl font-bold text-violet-800 mt-5">
                    {dinnerDemand}
                  </p>

                  <p className="text-xs text-violet-600 mt-1">
                    students expected
                  </p>

                </div>

              </div>

            </div>


            {/* =========================
                COMPLAINT + RESOLUTION
            ========================= */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* COMPLAINT ANALYSIS */}

              <div className="lg:col-span-2 bg-white rounded-2xl p-7 shadow-sm border border-slate-100">

                <div className="flex justify-between items-start">

                  <div>

                    <h2 className="text-xl font-semibold text-slate-900">
                      Complaint Analysis
                    </h2>

                    <p className="text-sm text-slate-400 mt-1">
                      How complaints are currently distributed
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-2xl font-bold text-slate-900">
                      {totalComplaints}
                    </p>

                    <p className="text-xs text-slate-400">
                      complaints
                    </p>

                  </div>

                </div>


                {/* BAR */}

                <div className="mt-8">

                  <div className="h-8 w-full bg-slate-100 rounded-xl overflow-hidden flex">

                    {pendingPercentage > 0 && (
                      <div
                        className="bg-amber-500"
                        style={{
                          width: `${pendingPercentage}%`,
                        }}
                      />
                    )}

                    {inProgressPercentage > 0 && (
                      <div
                        className="bg-cyan-500"
                        style={{
                          width: `${inProgressPercentage}%`,
                        }}
                      />
                    )}

                    {resolvedPercentage > 0 && (
                      <div
                        className="bg-violet-500"
                        style={{
                          width: `${resolvedPercentage}%`,
                        }}
                      />
                    )}

                  </div>

                </div>


                {/* LEGEND */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-7">

                  <div className="bg-amber-100 rounded-xl p-4">

                    <p className="text-sm text-amber-700">
                      Pending
                    </p>

                    <p className="text-2xl font-bold text-amber-800 mt-2">
                      {pending}
                    </p>

                    <p className="text-xs text-amber-600">
                      {pendingPercentage}% of complaints
                    </p>

                  </div>


                  <div className="bg-cyan-100 rounded-xl p-4">

                    <p className="text-sm text-cyan-700">
                      In Progress
                    </p>

                    <p className="text-2xl font-bold text-cyan-800 mt-2">
                      {inProgress}
                    </p>

                    <p className="text-xs text-cyan-600">
                      {inProgressPercentage}% of complaints
                    </p>

                  </div>


                  <div className="bg-violet-100 rounded-xl p-4">

                    <p className="text-sm text-violet-700">
                      Resolved
                    </p>

                    <p className="text-2xl font-bold text-violet-800 mt-2">
                      {resolved}
                    </p>

                    <p className="text-xs text-violet-600">
                      {resolvedPercentage}% of complaints
                    </p>

                  </div>

                </div>

              </div>


              {/* RESOLUTION */}

              <div className="bg-[#17142b] rounded-2xl p-7 text-white">

                <p className="text-sm text-violet-300">
                  Performance
                </p>

                <h2 className="text-xl font-semibold mt-2">
                  Resolution Rate
                </h2>

                <div className="flex justify-center my-9">

                  <div
                    className="w-44 h-44 rounded-full flex items-center justify-center"
                    style={{
                      background: `conic-gradient(
                        #a78bfa ${resolvedPercentage}%,
                        #302b4b ${resolvedPercentage}%
                      )`,
                    }}
                  >

                    <div className="w-36 h-36 rounded-full bg-[#17142b] flex flex-col items-center justify-center">

                      <p className="text-4xl font-bold">
                        {resolvedPercentage}%
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Resolution
                      </p>

                    </div>

                  </div>

                </div>

                <div className="space-y-4">

                  <div className="flex justify-between">

                    <span className="text-sm text-slate-400">
                      Resolved
                    </span>

                    <span className="font-semibold">
                      {resolved}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-sm text-slate-400">
                      Active
                    </span>

                    <span className="font-semibold">
                      {activeComplaints}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-sm text-slate-400">
                      Total
                    </span>

                    <span className="font-semibold">
                      {totalComplaints}
                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* =========================
                BOTTOM SUMMARY
            ========================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

              {/* WORKLOAD */}

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">

                <h2 className="text-lg font-semibold text-slate-900">
                  Current Workload
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Complaints that need attention
                </p>

                <div className="mt-6 space-y-4">

                  <div className="flex items-center justify-between bg-amber-100 rounded-xl px-5 py-4">

                    <div>

                      <p className="text-sm font-medium text-amber-800">
                        Pending
                      </p>

                      <p className="text-xs text-amber-600 mt-1">
                        Waiting for action
                      </p>

                    </div>

                    <p className="text-2xl font-bold text-amber-700">
                      {pending}
                    </p>

                  </div>


                  <div className="flex items-center justify-between bg-cyan-100 rounded-xl px-5 py-4">

                    <div>

                      <p className="text-sm font-medium text-cyan-800">
                        In Progress
                      </p>

                      <p className="text-xs text-cyan-600 mt-1">
                        Currently being handled
                      </p>

                    </div>

                    <p className="text-2xl font-bold text-cyan-700">
                      {inProgress}
                    </p>

                  </div>

                </div>

              </div>


              {/* SUMMARY */}

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">

                <h2 className="text-lg font-semibold text-slate-900">
                  Performance Summary
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Key system indicators
                </p>

                <div className="mt-5">

                  <div className="flex justify-between py-4 border-b border-slate-100">

                    <span className="text-sm text-slate-500">
                      Resolution Rate
                    </span>

                    <span className="font-bold text-violet-600">
                      {resolvedPercentage}%
                    </span>

                  </div>


                  <div className="flex justify-between py-4 border-b border-slate-100">

                    <span className="text-sm text-slate-500">
                      Active Complaints
                    </span>

                    <span className="font-bold text-cyan-600">
                      {activeComplaints}
                    </span>

                  </div>


                  <div className="flex justify-between py-4 border-b border-slate-100">

                    <span className="text-sm text-slate-500">
                      Average Rating
                    </span>

                    <span className="font-bold text-pink-600">
                      {averageRating} / 5
                    </span>

                  </div>


                  <div className="flex justify-between py-4">

                    <span className="text-sm text-slate-500">
                      Total Complaints
                    </span>

                    <span className="font-bold text-slate-800">
                      {totalComplaints}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </>
        )}

      </div>

    </div>
  );
}

export default Analytics;