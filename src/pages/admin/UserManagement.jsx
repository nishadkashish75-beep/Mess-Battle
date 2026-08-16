import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../firebase/config";
import UserTable from "../../components/admin/UserTable";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "users")
      );

      const userData = snapshot.docs.map(
        (userDoc) => ({
          id: userDoc.id,
          ...userDoc.data(),
        })
      );

      setUsers(userData);

    } catch (error) {
      console.error(
        "Error fetching users:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // DELETE USER
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await deleteDoc(
        doc(db, "users", id)
      );

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user.id !== id
        )
      );

      alert("User deleted successfully");

    } catch (error) {

      console.error(
        "Delete user error:",
        error
      );

      alert("Failed to delete user");
    }
  };


  // =========================
  // SEARCH
  // =========================

  const filteredUsers = users.filter(
    (user) => {

      const searchText =
        search.toLowerCase();

      const name = (
        user.name ||
        user.fullName ||
        user.username ||
        ""
      ).toLowerCase();

      const email = (
        user.email || ""
      ).toLowerCase();

      const role = (
        user.role || ""
      ).toLowerCase();

      return (
        name.includes(searchText) ||
        email.includes(searchText) ||
        role.includes(searchText)
      );
    }
  );


  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          User Management
        </h1>

        <p className="text-gray-500 mt-1">
          Manage registered users
        </p>

      </div>


      {/* Search */}

      <div className="bg-white p-5 rounded-xl shadow-md mb-6">

        <input
          type="text"
          placeholder="Search by name, email or role..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

      </div>


      {/* Table */}

      {loading ? (

        <div className="bg-white p-6 rounded-xl shadow text-center">

          <p className="text-gray-500">
            Loading users...
          </p>

        </div>

      ) : (

        <UserTable
          users={filteredUsers}
          onDelete={handleDelete}
        />

      )}

    </div>
  );
}

export default UserManagement;