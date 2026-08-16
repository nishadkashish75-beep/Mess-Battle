import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useDispatch } from "react-redux";

import App from "./App";
import { store } from "./store/store";
import { setUser } from "./features/auth/authSlice";

import "./index.css";

function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch(setUser(user));
      } catch (error) {
        console.error("Invalid user data:", error);
        dispatch(setUser(null));
      }
    } else {
      dispatch(setUser(null));
    }
  }, [dispatch]);

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthInitializer />
  </Provider>
);