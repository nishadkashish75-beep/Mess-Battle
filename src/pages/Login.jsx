import { useState } from "react";

import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase/config";

import { setUser } from "../features/auth/authSlice";

function Login() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    try {

      setLoading(true);

      // Firebase Login
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // Get Firestore user
      const userDoc = await getDoc(
        doc(db, "users", user.uid)
      );

      if (!userDoc.exists()) {

        setError(
          "User profile not found."
        );

        await signOut(auth);

        return;
      }

      const userData = userDoc.data();

      // =========================
      // PENDING
      // =========================

      if (userData.status === "pending") {

        setError(
          "Your staff registration is pending admin approval."
        );

        await signOut(auth);

        return;
      }

      // =========================
      // REJECTED
      // =========================

      if (userData.status === "rejected") {

        setError(
          "Your staff registration request was rejected by admin."
        );

        await signOut(auth);

        return;
      }

      // =========================
      // REDUX
      // =========================

      dispatch(
        setUser({
          uid: user.uid,
          name: userData.name,
          email: user.email,
          role: userData.role,
          status: userData.status,
        })
      );

      // =========================
      // ROLE REDIRECT
      // =========================

      if (
        userData.role === "student" &&
        userData.status === "approved"
      ) {

        navigate("/student");

      } else if (
        userData.role === "staff" &&
        userData.status === "approved"
      ) {

        navigate("/staff");

      } else if (
        userData.role === "admin" &&
        userData.status === "approved"
      ) {

        navigate("/admin");

      } else {

        setError("Invalid role or status.");

      }

    } catch (error) {

      console.error(error);

      setError(error.message);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >

        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border p-3 rounded mb-5"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

      </form>

    </div>
  );
}

export default Login;