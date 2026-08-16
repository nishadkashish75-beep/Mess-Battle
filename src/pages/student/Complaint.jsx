import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";

import { db } from "../../firebase/config";

import {
  setComplaints,
  setLoading,
  setError,
} from "../../features/complaints/complaintSlice";

function Complaint() {
  const [type, setType] = useState("Food Quality");
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();

  const loading = useSelector(
    (state) => state.complaint.loading
  );

  const error = useSelector(
    (state) => state.complaint.error
  );

  const complaints = useSelector(
    (state) => state.complaint.complaints
  );

  // Format complaint timestamp
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

  // Real-time complaints listener
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
          "Error listening to complaints:",
          error
        );

        dispatch(setError(error.message));
        dispatch(setLoading(false));
      }
    );

    return () => unsubscribe();
  }, [dispatch]);

  // Submit complaint
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      dispatch(
        setError("Please describe your complaint.")
      );
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const complaintData = {
        type,
        description: description.trim(),
        status: "Pending",
        createdAt: serverTimestamp(),
      };

      await addDoc(
        collection(db, "complaints"),
        complaintData
      );

      setDescription("");
      setType("Food Quality");
    } catch (error) {
      console.error(
        "Error submitting complaint:",
        error
      );

      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto w-full max-w-3xl">

        {/* Header */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-3xl shadow-lg shadow-red-200">
            🚨
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Report a Complaint
          </h1>

          <p className="mt-3 text-base text-gray-500 sm:text-lg">
            Help us improve your mess experience
          </p>

        </div>

        {/* Complaint Form */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Complaint Type */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Complaint Type
              </label>

              <div className="relative">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                  📋
                </span>

                <select
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-12 py-3.5 text-gray-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100"
                >
                  <option value="Food Quality">
                    Food Quality
                  </option>

                  <option value="Hygiene">
                    Hygiene
                  </option>

                  <option value="Quantity">
                    Quantity
                  </option>

                  <option value="Taste">
                    Taste
                  </option>

                  <option value="Timing">
                    Timing
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ▼
                </span>

              </div>

            </div>

            {/* Description */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Describe your complaint
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Tell us what happened..."
                rows={6}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100"
              />

              <p className="mt-2 text-right text-xs text-gray-400">
                {description.length} characters
              </p>

            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-5 py-3.5 font-semibold text-white shadow-lg shadow-red-200 transition-all duration-200 hover:-translate-y-0.5 hover:from-red-600 hover:to-orange-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading
                ? "Submitting..."
                : "Submit Complaint"}

              {!loading && (
                <span className="text-xl transition-transform group-hover:translate-x-1">
                  →
                </span>
              )}
            </button>

          </form>

        </div>

        {/* Complaints */}
        <div className="mt-10">

          <div className="mb-5 flex items-end justify-between">

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                My Complaints
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Track the status of your complaints
              </p>

            </div>

            <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
              {complaints.length}{" "}
              {complaints.length === 1
                ? "Complaint"
                : "Complaints"}
            </span>

          </div>

          {/* Empty State */}
          {complaints.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">

              <div className="mb-3 text-4xl">
                🎉
              </div>

              <h3 className="font-semibold text-gray-800">
                No complaints yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Everything looks good!
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md shadow-gray-200/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >

                  {/* Top */}
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl">
                        🚨
                      </div>

                      <div>

                        <h3 className="font-bold text-gray-900">
                          {complaint.type}
                        </h3>

                        <p className="text-xs text-gray-400">
                          Complaint
                        </p>

                      </div>

                    </div>

                    {/* Status */}
                    <span
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
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
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                    <span>🕐</span>

                    <span>
                      Submitted on{" "}
                      {formatDateTime(
                        complaint.createdAt
                      )}
                    </span>
                  </div>

                  {/* Status Progress */}
                  <div className="mt-5 flex items-center">

                    {/* Pending */}
                    <div className="flex flex-1 flex-col items-center">

                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          complaint.status ===
                            "Pending" ||
                          complaint.status ===
                            "In Progress" ||
                          complaint.status ===
                            "Resolved"
                            ? "bg-yellow-400 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        1
                      </div>

                      <span className="mt-1 text-xs text-gray-500">
                        Pending
                      </span>

                    </div>

                    {/* Line */}
                    <div
                      className={`h-1 flex-1 rounded ${
                        complaint.status ===
                          "In Progress" ||
                        complaint.status ===
                          "Resolved"
                          ? "bg-blue-400"
                          : "bg-gray-200"
                      }`}
                    />

                    {/* In Progress */}
                    <div className="flex flex-1 flex-col items-center">

                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          complaint.status ===
                            "In Progress" ||
                          complaint.status ===
                            "Resolved"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        2
                      </div>

                      <span className="mt-1 text-xs text-gray-500">
                        In Progress
                      </span>

                    </div>

                    {/* Line */}
                    <div
                      className={`h-1 flex-1 rounded ${
                        complaint.status ===
                        "Resolved"
                          ? "bg-green-400"
                          : "bg-gray-200"
                      }`}
                    />

                    {/* Resolved */}
                    <div className="flex flex-1 flex-col items-center">

                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          complaint.status ===
                          "Resolved"
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        3
                      </div>

                      <span className="mt-1 text-xs text-gray-500">
                        Resolved
                      </span>

                    </div>

                  </div>

                  {/* Description */}
                  <p className="mt-5 rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                    {complaint.description}
                  </p>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Complaint;