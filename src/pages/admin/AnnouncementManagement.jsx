import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase/config";
import AnnouncementForm from "../../components/admin/AnnouncementForm";

function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState([]);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH ANNOUNCEMENTS
  // =========================

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "announcements")
      );

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setAnnouncements(data);
    } catch (error) {
      console.error(
        "Error fetching announcements:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ADD ANNOUNCEMENT
  // =========================

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      alert("Please enter title and message");
      return;
    }

    try {
      const announcement = {
        title: title.trim(),
        message: message.trim(),
        active: true,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "announcements"),
        announcement
      );

      setAnnouncements((previous) => [
        {
          id: docRef.id,
          ...announcement,
        },
        ...previous,
      ]);

      setTitle("");
      setMessage("");

      alert("Announcement added successfully");
    } catch (error) {
      console.error(
        "Add announcement error:",
        error
      );

      alert("Failed to add announcement");
    }
  };

  // =========================
  // TOGGLE STATUS
  // =========================

  const handleToggleStatus = async (
    id,
    currentStatus
  ) => {
    try {
      await updateDoc(
        doc(db, "announcements", id),
        {
          active: !currentStatus,
        }
      );

      setAnnouncements((previous) =>
        previous.map((item) =>
          item.id === id
            ? {
                ...item,
                active: !currentStatus,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Update announcement error:",
        error
      );

      alert("Failed to update announcement");
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteDoc(
        doc(db, "announcements", id)
      );

      setAnnouncements((previous) =>
        previous.filter(
          (item) => item.id !== id
        )
      );

      alert("Announcement deleted successfully");
    } catch (error) {
      console.error(
        "Delete announcement error:",
        error
      );

      alert("Failed to delete announcement");
    }
  };

  // =========================
  // COUNTS
  // =========================

  const activeCount = announcements.filter(
    (item) => item.active === true
  ).length;

  const inactiveCount =
    announcements.length - activeCount;

  return (
    <div className="min-h-screen bg-[#f6f7fb]">

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">

          <div>

            <p className="text-xs font-semibold tracking-[0.2em] text-violet-600 uppercase">
              Mess Communication
            </p>

            <h1 className="text-3xl font-bold text-slate-900 mt-2">
              Announcements
            </h1>

            <p className="text-slate-500 mt-2">
              Create and manage important mess updates.
            </p>

          </div>

          {/* ACTIVE SUMMARY */}

          <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-slate-100">

            <p className="text-xs text-slate-400 uppercase tracking-wide">
              Active Announcements
            </p>

            <div className="flex items-end gap-2 mt-1">

              <span className="text-3xl font-bold text-slate-900">
                {activeCount}
              </span>

              <span className="text-sm text-slate-400 mb-1">
                active
              </span>

            </div>

          </div>

        </div>


        {/* =========================
            STAT CARDS
        ========================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

          {/* TOTAL */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">

            <div className="absolute right-0 top-0 w-24 h-24 bg-violet-200 rounded-bl-full">
            </div>

            <p className="text-sm text-slate-500">
              Total Announcements
            </p>

            <p className="text-4xl font-bold text-slate-900 mt-3">
              {announcements.length}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              All announcements
            </p>

          </div>


          {/* ACTIVE */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">

            <div className="absolute right-0 top-0 w-24 h-24 bg-cyan-200 rounded-bl-full">
            </div>

            <p className="text-sm text-slate-500">
              Active Announcements
            </p>

            <p className="text-4xl font-bold text-cyan-600 mt-3">
              {activeCount}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              Currently active
            </p>

          </div>


          {/* INACTIVE */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">

            <div className="absolute right-0 top-0 w-24 h-24 bg-pink-200 rounded-bl-full">
            </div>

            <p className="text-sm text-slate-500">
              Inactive Announcements
            </p>

            <p className="text-4xl font-bold text-pink-600 mt-3">
              {inactiveCount}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              Currently disabled
            </p>

          </div>

        </div>


        {/* =========================
            MAIN CONTENT
        ========================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* =========================
              CREATE ANNOUNCEMENT
          ========================= */}

          <div className="lg:col-span-1">

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">

              <p className="text-xs font-semibold tracking-[0.15em] text-violet-600 uppercase">
                New Update
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-2">
                Create Announcement
              </h2>

              <p className="text-sm text-slate-400 mt-1 mb-6">
                Add a new message for mess users.
              </p>

              <AnnouncementForm
                title={title}
                message={message}
                setTitle={setTitle}
                setMessage={setMessage}
                onSubmit={handleAddAnnouncement}
              />

            </div>

          </div>


          {/* =========================
              ANNOUNCEMENT LIST
          ========================= */}

          <div className="lg:col-span-2">

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

              {/* LIST HEADER */}

              <div className="p-6 border-b border-slate-100">

                <div className="flex justify-between items-start">

                  <div>

                    <p className="text-xs font-semibold tracking-[0.15em] text-violet-600 uppercase">
                      Updates
                    </p>

                    <h2 className="text-xl font-semibold text-slate-900 mt-1">
                      All Announcements
                    </h2>

                    <p className="text-sm text-slate-400 mt-1">
                      Manage your mess updates
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-2xl font-bold text-slate-900">
                      {announcements.length}
                    </p>

                    <p className="text-xs text-slate-400">
                      total
                    </p>

                  </div>

                </div>

              </div>


              {/* =========================
                  LOADING
              ========================= */}

              {loading && (

                <div className="p-14 text-center">

                  <div className="w-8 h-8 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin mx-auto">
                  </div>

                  <p className="text-slate-500 mt-4">
                    Loading announcements...
                  </p>

                </div>

              )}


              {/* =========================
                  EMPTY
              ========================= */}

              {!loading &&
                announcements.length === 0 && (

                  <div className="p-14 text-center">

                    <div className="w-14 h-14 bg-violet-100 rounded-xl mx-auto flex items-center justify-center">

                      <div className="w-6 h-5 border-2 border-violet-500 rounded-md">
                      </div>

                    </div>

                    <h3 className="text-lg font-semibold text-slate-700 mt-4">
                      No announcements
                    </h3>

                    <p className="text-sm text-slate-400 mt-1">
                      Create your first announcement
                      from the form.
                    </p>

                  </div>

                )}


              {/* =========================
                  ANNOUNCEMENTS
              ========================= */}

              {!loading &&
                announcements.length > 0 && (

                  <div className="divide-y divide-slate-100">

                    {announcements.map(
                      (announcement) => (

                        <div
                          key={announcement.id}
                          className="p-6 hover:bg-slate-50 transition"
                        >

                          <div className="flex flex-col gap-4">

                            {/* TITLE */}

                            <div className="flex items-start justify-between gap-4">

                              <div className="flex-1">

                                <div className="flex items-center gap-3 flex-wrap">

                                  <h3 className="text-lg font-semibold text-slate-900">
                                    {announcement.title}
                                  </h3>

                                  {/* STATUS */}

                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      announcement.active
                                        ? "bg-cyan-100 text-cyan-700"
                                        : "bg-slate-200 text-slate-600"
                                    }`}
                                  >
                                    {announcement.active
                                      ? "Active"
                                      : "Inactive"}
                                  </span>

                                </div>

                              </div>

                            </div>


                            {/* MESSAGE */}

                            <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">

                              <p className="text-sm text-slate-600 leading-6">
                                {announcement.message}
                              </p>

                            </div>


                            {/* ACTIONS */}

                            <div className="flex items-center gap-3">

                              <button
                                onClick={() =>
                                  handleToggleStatus(
                                    announcement.id,
                                    announcement.active
                                  )
                                }
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                  announcement.active
                                    ? "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                    : "bg-violet-600 text-white hover:bg-violet-700"
                                }`}
                              >
                                {announcement.active
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>


                              <button
                                onClick={() =>
                                  handleDelete(
                                    announcement.id
                                  )
                                }
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-pink-100 text-pink-700 hover:bg-pink-200 transition"
                              >
                                Delete
                              </button>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AnnouncementManagement;