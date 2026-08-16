import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import ComplaintTable from "../../components/admin/ComplaintTable";

function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // =========================
  // FETCH COMPLAINTS
  // =========================

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "complaints")
      );

      const complaintData = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setComplaints(complaintData);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STATUS UPDATE
  // =========================

  const handleStatusUpdate = (id, newStatus) => {
    setComplaints((previousComplaints) =>
      previousComplaints.map((complaint) =>
        complaint.id === id
          ? {
              ...complaint,
              status: newStatus,
            }
          : complaint
      )
    );
  };

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = search.toLowerCase().trim();

    const userName = (
      complaint.userName ||
      complaint.email ||
      complaint.userId ||
      ""
    ).toLowerCase();

    const description = (
      complaint.description ||
      complaint.complaint ||
      complaint.complaintText ||
      ""
    ).toLowerCase();

    const matchesSearch =
      userName.includes(searchText) ||
      description.includes(searchText);

    const complaintStatus = (
      complaint.status || "Pending"
    )
      .toLowerCase()
      .trim();

    const matchesStatus =
      statusFilter === "All" ||
      complaintStatus === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // =========================
  // STATUS COUNTS
  // =========================

  const pendingCount = complaints.filter((complaint) => {
    const status = (complaint.status || "Pending")
      .toLowerCase()
      .trim();

    return status === "pending";
  }).length;

  const inProgressCount = complaints.filter((complaint) => {
    const status = (complaint.status || "")
      .toLowerCase()
      .trim();

    return (
      status === "in progress" ||
      status === "in-progress"
    );
  }).length;

  const resolvedCount = complaints.filter((complaint) => {
    const status = (complaint.status || "")
      .toLowerCase()
      .trim();

    return status === "resolved";
  }).length;

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">

          <div>

            <p className="text-xs font-semibold tracking-widest text-violet-600 uppercase">
              Issue Management
            </p>

            <h1 className="text-3xl font-bold mt-2">
              Complaint Management
            </h1>

            <p className="mt-2">
              Manage and track all mess complaints.
            </p>

          </div>

          {/* TOTAL COMPLAINTS */}

          <div className="bg-white rounded-2xl px-6 py-4 shadow-sm">

            <p className="text-xs uppercase tracking-wide">
              Total Complaints
            </p>

            <div className="flex items-end gap-2 mt-1">

              <span className="text-3xl font-bold">
                {complaints.length}
              </span>

              <span className="text-sm mb-1">
                complaints
              </span>

            </div>

          </div>

        </div>


        {/* =========================
            STAT CARDS
        ========================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

          {/* PENDING */}

          <div className="bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden">

            <div className="absolute right-0 top-0 w-24 h-24 bg-amber-200 rounded-bl-full">
            </div>

            <p className="text-sm">
              Pending Complaints
            </p>

            <p className="text-4xl font-bold text-amber-600 mt-3">
              {pendingCount}
            </p>

            <p className="text-xs mt-2">
              Waiting for action
            </p>

          </div>


          {/* IN PROGRESS */}

          <div className="bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden">

            <div className="absolute right-0 top-0 w-24 h-24 bg-cyan-200 rounded-bl-full">
            </div>

            <p className="text-sm">
              In Progress
            </p>

            <p className="text-4xl font-bold text-cyan-600 mt-3">
              {inProgressCount}
            </p>

            <p className="text-xs mt-2">
              Currently being handled
            </p>

          </div>


          {/* RESOLVED */}

          <div className="bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden">

            <div className="absolute right-0 top-0 w-24 h-24 bg-violet-200 rounded-bl-full">
            </div>

            <p className="text-sm">
              Resolved Complaints
            </p>

            <p className="text-4xl font-bold text-violet-600 mt-3">
              {resolvedCount}
            </p>

            <p className="text-xs mt-2">
              Successfully resolved
            </p>

          </div>

        </div>


        {/* =========================
            SEARCH + FILTER
        ========================= */}

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">

          <div className="flex flex-col md:flex-row gap-4">

            {/* SEARCH */}

            <div className="flex-1">

              <label className="block text-sm font-medium mb-2">
                Search Complaints
              </label>

              <input
                type="text"
                placeholder="Search by user or complaint..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-200"
              />

            </div>


            {/* STATUS FILTER */}

            <div className="w-full md:w-56">

              <label className="block text-sm font-medium mb-2">
                Filter by Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-200"
              >

                <option value="All">
                  All Status
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>

              </select>

            </div>

          </div>

        </div>


        {/* =========================
            COMPLAINT TABLE
        ========================= */}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* TABLE HEADER */}

          <div className="p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>

                <p className="text-xs font-semibold tracking-widest text-violet-600 uppercase">
                  Complaint Records
                </p>

                <h2 className="text-xl font-semibold mt-1">
                  All Complaints
                </h2>

                <p className="text-sm mt-1">
                  Review and update complaint status.
                </p>

              </div>


              {/* SHOWING COUNT */}

              <div className="bg-violet-200 rounded-xl px-4 py-3">

                <p className="text-xs text-violet-600">
                  Showing
                </p>

                <p className="text-xl font-bold text-violet-700">
                  {filteredComplaints.length}
                </p>

              </div>

            </div>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="p-14 text-center">

              <div className="w-8 h-8 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin mx-auto">
              </div>

              <p className="mt-4">
                Loading complaints...
              </p>

            </div>

          )}


          {/* EMPTY */}

          {!loading &&
            filteredComplaints.length === 0 && (

              <div className="p-14 text-center">

                <div className="w-14 h-14 bg-violet-200 rounded-xl mx-auto flex items-center justify-center">

                  <div className="w-6 h-6 rounded-md bg-violet-500">
                  </div>

                </div>

                <h3 className="text-lg font-semibold mt-4">
                  No complaints found
                </h3>

                <p className="text-sm mt-1">
                  Try changing your search or status filter.
                </p>

              </div>

            )}


          {/* TABLE */}

          {!loading &&
            filteredComplaints.length > 0 && (

              <div className="p-4 md:p-6 overflow-x-auto">

                <ComplaintTable
                  complaints={filteredComplaints}
                  onStatusUpdate={handleStatusUpdate}
                />

              </div>

            )}

        </div>

      </div>

    </div>
  );
}

export default ComplaintManagement;