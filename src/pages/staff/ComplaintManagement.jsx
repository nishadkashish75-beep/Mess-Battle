import { useEffect } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";

import { db } from "../../firebase/config";

import {
  setComplaints,
  setLoading,
  setError,
} from "../../features/complaints/complaintSlice";

function ComplaintManagement() {
  const dispatch = useDispatch();

  const complaints = useSelector(
    (state) => state.complaint.complaints
  );

  const loading = useSelector(
    (state) => state.complaint.loading
  );

  const error = useSelector(
    (state) => state.complaint.error
  );

  // Format timestamp
  const formatDateTime = (timestamp) => {
    if (!timestamp) {
      return "Just now";
    }

    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Real-time complaints
  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const unsubscribe = onSnapshot(
      collection(db, "complaints"),
      (snapshot) => {
        const complaintList = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

        dispatch(setComplaints(complaintList));
        dispatch(setLoading(false));
      },
      (error) => {
        console.error(
          "Error fetching complaints:",
          error
        );

        dispatch(setError(error.message));
        dispatch(setLoading(false));
      }
    );

    return () => unsubscribe();
  }, [dispatch]);

  // Update complaint status
  const updateComplaintStatus = async (
    complaintId,
    newStatus
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const complaintRef = doc(
        db,
        "complaints",
        complaintId
      );

      await updateDoc(complaintRef, {
        status: newStatus,
      });
    } catch (error) {
      console.error(
        "Error updating complaint:",
        error
      );

      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto w-full max-w-5xl">

        {/* Header */}
        <div className="mb-8">

          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-2xl shadow-lg shadow-red-200">
            🚨
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Complaint Management
          </h1>

          <p className="mt-2 text-gray-500">
            Review student complaints and update their
            status.
          </p>

        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Total */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md shadow-gray-200/50">

            <p className="text-sm font-medium text-gray-500">
              Total Complaints
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {complaints.length}
            </p>

          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-5">

            <p className="text-sm font-medium text-yellow-700">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-800">
              {
                complaints.filter(
                  (complaint) =>
                    complaint.status === "Pending"
                ).length
              }
            </p>

          </div>

          {/* Resolved */}
          <div className="rounded-2xl border border-green-100 bg-green-50 p-5">

            <p className="text-sm font-medium text-green-700">
              Resolved
            </p>

            <p className="mt-2 text-3xl font-bold text-green-800">
              {
                complaints.filter(
                  (complaint) =>
                    complaint.status === "Resolved"
                ).length
              }
            </p>

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}

        {/* Loading / Complaints */}
        {loading && complaints.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center shadow-md">

            <div className="text-3xl">
              ⏳
            </div>

            <p className="mt-3 font-medium text-gray-600">
              Loading complaints...
            </p>

          </div>
        ) : complaints.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">

            <div className="mb-3 text-5xl">
              🎉
            </div>

            <h2 className="text-lg font-bold text-gray-800">
              No complaints
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              There are no complaints to manage right
              now.
            </p>

          </div>
        ) : (
          <div className="space-y-5">

            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md shadow-gray-200/40 transition hover:shadow-lg sm:p-6"
              >

                {/* Top */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl">
                      🚨
                    </div>

                    <div>

                      <h2 className="font-bold text-gray-900">
                        {complaint.type}
                      </h2>

                      <p className="text-xs text-gray-400">
                        Student Complaint
                      </p>

                    </div>

                  </div>

                  {/* Current Status */}
                  <span
                    className={`w-fit rounded-lg px-3 py-1.5 text-xs font-bold ${
                      complaint.status ===
                      "Pending"
                        ? "bg-yellow-50 text-yellow-700"
                        : complaint.status ===
                          "In Progress"
                        ? "bg-blue-50 text-blue-700"
                        : complaint.status ===
                          "Resolved"
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {complaint.status}
                  </span>

                </div>

                {/* Timestamp */}
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-xs text-indigo-600">

                  <span className="text-base">
                    🕐
                  </span>

                  <div>
                    <span className="font-semibold">
                      Submitted:
                    </span>{" "}
                    {formatDateTime(
                      complaint.createdAt
                    )}
                  </div>

                </div>

                {/* Description */}
                <div className="mt-5 rounded-xl bg-gray-50 p-4">

                  <p className="text-sm leading-6 text-gray-600">
                    {complaint.description}
                  </p>

                </div>

                {/* Status Controls */}
                <div className="mt-5">

                  <p className="mb-3 text-sm font-semibold text-gray-700">
                    Update Status
                  </p>

                  <div className="flex flex-wrap gap-3">

                    {/* Pending */}
                    <button
                      type="button"
                      disabled={
                        complaint.status ===
                        "Pending"
                      }
                      onClick={() =>
                        updateComplaintStatus(
                          complaint.id,
                          "Pending"
                        )
                      }
                      className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-2.5 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      🟡 Pending
                    </button>

                    {/* In Progress */}
                    <button
                      type="button"
                      disabled={
                        complaint.status ===
                        "In Progress"
                      }
                      onClick={() =>
                        updateComplaintStatus(
                          complaint.id,
                          "In Progress"
                        )
                      }
                      className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      🔵 In Progress
                    </button>

                    {/* Resolved */}
                    <button
                      type="button"
                      disabled={
                        complaint.status ===
                        "Resolved"
                      }
                      onClick={() =>
                        updateComplaintStatus(
                          complaint.id,
                          "Resolved"
                        )
                      }
                      className="rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      🟢 Resolved
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default ComplaintManagement;