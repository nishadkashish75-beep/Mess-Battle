import { useState } from "react";

import { createUserWithEmailAndPassword } from "firebase/auth";

import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase/config";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    // Check all fields
    if (!name || !email || !password || !role) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // =====================================
      // 1. CREATE FIREBASE AUTH ACCOUNT
      // =====================================

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // =====================================
      // 2. STUDENT REGISTRATION
      // =====================================

      if (role === "student") {
        await setDoc(
          doc(db, "users", user.uid),
          {
            uid: user.uid,
            name: name,
            email: email,
            role: "student",
            status: "approved",
            createdAt: serverTimestamp(),
          }
        );

        alert("Student registration successful!");

        navigate("/login");

        return;
      }

      // =====================================
      // ADMIN REGISTRATION
      // =====================================

      if (role === "admin") {
        await setDoc(
          doc(db, "users", user.uid),
          {
            uid: user.uid,
            name: name,
            email: email,
            role: "admin",
            status: "approved",
            createdAt: serverTimestamp(),
          }
        );

        alert("Admin registration successful!");

        navigate("/login");

        return;
      }

      // =====================================
      // 3. STAFF REGISTRATION
      // =====================================

      if (role === "staff") {

        // -------------------------------------
        // Create user profile
        // -------------------------------------

        await setDoc(
          doc(db, "users", user.uid),
          {
            uid: user.uid,
            name: name,
            email: email,

            // User requested staff role
            role: "staff",

            // Staff cannot directly access dashboard
            status: "pending",

            createdAt: serverTimestamp(),
          }
        );

        // -------------------------------------
        // Create staff request
        // -------------------------------------

        await addDoc(
          collection(db, "staffRequests"),
          {
            userId: user.uid,
            name: name,
            email: email,

            requestedRole: "staff",

            // Admin has not approved yet
            status: "pending",

            createdAt: serverTimestamp(),
          }
        );

        // =====================================
        // 4. SEND NOTIFICATION TO ADMIN
        // =====================================

        await addDoc(
          collection(db, "notifications"),
          {
            // 🔴 YAHAN ACTUAL ADMIN UID DAALO
            userId: "ADMIN_UID",

            title: "New Staff Request",

            message:
              `${name} has requested staff access.`,

            type: "staff_request",

            // Notification is unread
            read: false,

            createdAt: serverTimestamp(),

            // Requesting user's UID
            relatedId: user.uid,
          }
        );

        // =====================================
        // 5. SUCCESS MESSAGE
        // =====================================

        alert(
          "Staff request sent to admin. Please wait for approval."
        );

        navigate("/login");
      }

    } catch (error) {
      console.error("Registration Error:", error);

      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >

        <h1 className="text-3xl font-bold text-center mb-6">
          Register
        </h1>

        {/* Error */}

        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        {/* Name */}

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        {/* Email */}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        {/* Password */}

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        {/* Role */}

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-3 rounded mb-5"
        >
          <option value="">
            Select your role
          </option>

          <option value="student">
            Student
          </option>

          <option value="staff">
            Staff
          </option>

          <option value="admin">
            Admin
          </option>
        </select>

        {/* Register Button */}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Creating Account..."
            : "Register"}
        </button>

      </form>
    </div>
  );
}

export default Register;