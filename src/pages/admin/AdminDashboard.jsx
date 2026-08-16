import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  collection,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../firebase/config";

function AdminDashboard() {
  const navigate = useNavigate();

  // =========================
  // MAIN STATS
  // =========================

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalComplaints, setTotalComplaints] = useState(0);
  const [averageRating, setAverageRating] = useState("0.0");

  // =========================
  // COMPLAINT STATUS
  // =========================

  const [todaysMeals, setTodaysMeals] = useState(0);
  const [pendingComplaints, setPendingComplaints] = useState(0);
  const [inProgressComplaints, setInProgressComplaints] =
    useState(0);
  const [resolvedComplaints, setResolvedComplaints] =
    useState(0);

  // =========================
  // REGISTRATION REQUESTS
  // =========================

  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    // =========================
    // USERS + STUDENTS
    // =========================

    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "users")
        );

        // Total users
        setTotalUsers(snapshot.size);

        // Count students
        let students = 0;

        snapshot.forEach((document) => {
          const data = document.data();

          const role = (data.role || "")
            .toLowerCase()
            .trim();

          if (role === "student" || role === "user") {
            students++;
          }
        });

        setTotalStudents(students);
      } catch (error) {
        console.error("Users fetch error:", error);
      }
    };

    // =========================
    // STAFF
    // =========================

    const fetchStaff = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "staff")
        );

        setTotalStaff(snapshot.size);
      } catch (error) {
        console.error("Staff fetch error:", error);
      }
    };

    // =========================
    // COMPLAINTS
    // =========================

    const fetchComplaints = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "complaints")
        );

        setTotalComplaints(snapshot.size);

        let pending = 0;
        let inProgress = 0;
        let resolved = 0;

        snapshot.forEach((document) => {
          const data = document.data();

          const status = (data.status || "")
            .toLowerCase()
            .trim();

          if (status === "pending") {
            pending++;
          }

          if (
            status === "in progress" ||
            status === "in-progress"
          ) {
            inProgress++;
          }

          if (status === "resolved") {
            resolved++;
          }
        });

        setPendingComplaints(pending);
        setInProgressComplaints(inProgress);
        setResolvedComplaints(resolved);
      } catch (error) {
        console.error(
          "Complaints fetch error:",
          error
        );
      }
    };

    // =========================
    // FEEDBACK
    // =========================

    const fetchFeedback = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "feedback")
        );

        let totalRating = 0;
        let ratingCount = 0;

        snapshot.forEach((document) => {
          const data = document.data();

          if (
            data.rating !== undefined &&
            data.rating !== null
          ) {
            const rating = Number(data.rating);

            if (!isNaN(rating)) {
              totalRating += rating;
              ratingCount++;
            }
          }
        });

        if (ratingCount > 0) {
          setAverageRating(
            (totalRating / ratingCount).toFixed(1)
          );
        } else {
          setAverageRating("0.0");
        }
      } catch (error) {
        console.error(
          "Feedback fetch error:",
          error
        );
      }
    };

    // =========================
    // MEALS
    // =========================

    const fetchMeals = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "meals")
        );

        setTodaysMeals(snapshot.size);
      } catch (error) {
        console.error(
          "Meals fetch error:",
          error
        );
      }
    };

    // =========================
    // REAL-TIME REGISTRATION REQUESTS
    // =========================

    let users = [];
    let staff = [];

    const updateRequestCount = () => {
      const allRequests = [
        ...users,
        ...staff,
      ];

      const pending = allRequests.filter(
        (item) => {
          const status = (item.status || "")
            .toLowerCase()
            .trim();

          return status === "pending";
        }
      );

      setPendingRequests(pending.length);
    };

    // Users listener
    const unsubscribeUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        users = snapshot.docs.map(
          (document) => ({
            id: document.id,
            ...document.data(),
          })
        );

        updateRequestCount();
      },
      (error) => {
        console.error(
          "User request listener error:",
          error
        );
      }
    );

    // Staff listener
    const unsubscribeStaff = onSnapshot(
      collection(db, "staff"),
      (snapshot) => {
        staff = snapshot.docs.map(
          (document) => ({
            id: document.id,
            ...document.data(),
          })
        );

        updateRequestCount();
      },
      (error) => {
        console.error(
          "Staff request listener error:",
          error
        );
      }
    );

    // =========================
    // FETCH EVERYTHING
    // =========================

    fetchUsers();
    fetchStaff();
    fetchComplaints();
    fetchFeedback();
    fetchMeals();

    // =========================
    // CLEANUP
    // =========================

    return () => {
      unsubscribeUsers();
      unsubscribeStaff();
    };
  }, []);

  // =========================
  // RESOLUTION PERCENTAGE
  // =========================

  const resolutionPercentage =
    totalComplaints > 0
      ? Math.round(
          (resolvedComplaints /
            totalComplaints) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-7">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Admin Dashboard
              </h1>

              <p className="text-gray-500 mt-1">
                Overview of your mess management system
              </p>
            </div>

            {/* REGISTRATION BUTTON */}

            <button
              onClick={() =>
                navigate(
                  "/admin/registration-requests"
                )
              }
              className="relative bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition"
            >
              🔔 Registration Requests

              {pendingRequests > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {pendingRequests}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* =========================
            MAIN STAT CARDS
        ========================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* TOTAL USERS */}

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">

            <p className="text-gray-500 text-sm">
              Total Users
            </p>

            <p className="text-3xl font-bold text-blue-600 mt-3">
              {totalUsers}
            </p>

          </div>

          {/* TOTAL STUDENTS */}

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">

            <p className="text-gray-500 text-sm">
              Total Students
            </p>

            <p className="text-3xl font-bold text-green-600 mt-3">
              {totalStudents}
            </p>

          </div>

          {/* TOTAL STAFF */}

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">

            <p className="text-gray-500 text-sm">
              Total Staff
            </p>

            <p className="text-3xl font-bold text-purple-600 mt-3">
              {totalStaff}
            </p>

          </div>

          {/* TOTAL COMPLAINTS */}

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">

            <p className="text-gray-500 text-sm">
              Total Complaints
            </p>

            <p className="text-3xl font-bold text-orange-600 mt-3">
              {totalComplaints}
            </p>

          </div>

          {/* AVERAGE RATING */}

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">

            <p className="text-gray-500 text-sm">
              Average Rating
            </p>

            <p className="text-3xl font-bold text-yellow-600 mt-3">
              ⭐ {averageRating}
            </p>

          </div>

        </div>

        {/* =========================
            REGISTRATION REQUEST CARD
        ========================= */}

        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h2 className="text-xl font-semibold text-gray-800">
                Registration Requests
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                New users and staff waiting for approval
              </p>

            </div>

            <div className="flex items-center gap-4">

              <div className="text-center">

                <p className="text-3xl font-bold text-red-600">
                  {pendingRequests}
                </p>

                <p className="text-sm text-gray-500">
                  Pending
                </p>

              </div>

              <button
                onClick={() =>
                  navigate(
                    "/admin/registration-requests"
                  )
                }
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition"
              >
                Manage
              </button>

            </div>

          </div>

        </div>

        {/* =========================
            SYSTEM MONITORING
        ========================= */}

        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">

          <div className="mb-5">

            <h2 className="text-xl font-semibold text-gray-800">
              System Monitoring
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Current status of the mess management system
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* MEALS */}

            <div className="bg-green-50 border border-green-100 rounded-lg p-5">

              <p className="text-green-700 text-sm font-medium">
                Today's Meals
              </p>

              <p className="text-2xl font-bold text-green-700 mt-2">
                {todaysMeals}
              </p>

            </div>

            {/* PENDING COMPLAINTS */}

            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-5">

              <p className="text-yellow-700 text-sm font-medium">
                Pending Complaints
              </p>

              <p className="text-2xl font-bold text-yellow-700 mt-2">
                {pendingComplaints}
              </p>

            </div>

            {/* IN PROGRESS */}

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">

              <p className="text-blue-700 text-sm font-medium">
                In Progress
              </p>

              <p className="text-2xl font-bold text-blue-700 mt-2">
                {inProgressComplaints}
              </p>

            </div>

            {/* RESOLVED */}

            <div className="bg-green-50 border border-green-100 rounded-lg p-5">

              <p className="text-green-700 text-sm font-medium">
                Resolved
              </p>

              <p className="text-2xl font-bold text-green-700 mt-2">
                {resolvedComplaints}
              </p>

            </div>

          </div>

        </div>

        {/* =========================
            QUICK STATUS
        ========================= */}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* RESOLUTION */}

          <div className="bg-white p-5 rounded-xl shadow-sm">

            <p className="text-gray-500 text-sm">
              Complaint Resolution
            </p>

            <p className="text-2xl font-bold text-green-600 mt-2">
              {resolutionPercentage}%
            </p>

            <div className="mt-3 h-2 bg-gray-200 rounded-full">

              <div
                className="h-2 bg-green-500 rounded-full"
                style={{
                  width: `${resolutionPercentage}%`,
                }}
              />

            </div>

          </div>

          {/* COMPLAINTS */}

          <div className="bg-white p-5 rounded-xl shadow-sm">

            <p className="text-gray-500 text-sm">
              Total Complaints
            </p>

            <p className="text-2xl font-bold text-orange-600 mt-2">
              {totalComplaints}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              All complaints received
            </p>

          </div>

          {/* STAFF */}

          <div className="bg-white p-5 rounded-xl shadow-sm">

            <p className="text-gray-500 text-sm">
              Staff Availability
            </p>

            <p className="text-2xl font-bold text-purple-600 mt-2">
              {totalStaff}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Registered staff members
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;