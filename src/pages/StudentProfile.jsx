import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

import { setProfile } from "../features/student/studentSlice";

function StudentProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.student.profile);

  const [name, setName] = useState(profile?.name || "");
  const [hostel, setHostel] = useState(profile?.hostel || "");
  const [room, setRoom] = useState(profile?.room || "");

  const [editing, setEditing] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const profileRef = doc(db, "users", user.uid);

      const updatedProfile = {
        name: name,
        email: user.email,
        hostel: hostel,
        room: room,
      };

      await updateDoc(profileRef, updatedProfile);

      // Redux update
      dispatch(setProfile(updatedProfile));

      setEditing(false);

      console.log("Profile updated successfully");

    } catch (error) {
      console.log("Profile update error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">

        <h1 className="text-2xl font-bold text-blue-600">
          Mess Battle
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 font-medium hover:text-blue-800"
        >
          Dashboard
        </button>

      </nav>


      <main className="max-w-2xl mx-auto px-6 py-10">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* Heading */}
          <div className="text-center mb-8">

            <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">

              <span className="text-3xl font-bold text-blue-600">
                {profile?.name?.charAt(0)?.toUpperCase() || "S"}
              </span>

            </div>

            <h1 className="text-2xl font-bold text-slate-800 mt-4">
              Student Profile
            </h1>

            <p className="text-slate-500">
              Manage your profile information
            </p>

          </div>


          {/* Profile */}
          {!editing ? (

            <div className="space-y-4">

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">
                  Name
                </p>

                <p className="font-semibold text-slate-800 mt-1">
                  {profile?.name || "N/A"}
                </p>
              </div>


              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="font-semibold text-slate-800 mt-1">
                  {user?.email || "N/A"}
                </p>
              </div>


              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">
                  Hostel
                </p>

                <p className="font-semibold text-slate-800 mt-1">
                  {profile?.hostel || "N/A"}
                </p>
              </div>


              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">
                  Room Number
                </p>

                <p className="font-semibold text-slate-800 mt-1">
                  {profile?.room || "N/A"}
                </p>
              </div>


              <button
                onClick={() => setEditing(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Edit Profile
              </button>

            </div>

          ) : (

            /* Edit Form */

            <form
              onSubmit={handleUpdate}
              className="space-y-5"
            >

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>


              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 border border-slate-200 bg-slate-100 text-slate-500 rounded-lg"
                />

              </div>


              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hostel
                </label>

                <input
                  type="text"
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>


              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Room Number
                </label>

                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>


              <div className="flex gap-3">

                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Save Changes
                </button>


                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 border border-slate-300 hover:bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>

              </div>

            </form>

          )}

        </div>

      </main>

    </div>
  );
}

export default StudentProfile;