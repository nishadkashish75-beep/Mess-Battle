import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import studentReducer from "../features/student/studentSlice";

import feedbackReducer from "../features/feedback/feedbackSlice";
import complaintReducer from "../features/complaints/complaintSlice";
import voteReducer from "../features/voting/voteSlice";

import menuReducer from "../features/menu/menuSlice";
import mealReducer from "../features/meals/mealSlice";

export const store = configureStore({
  reducer: {
    // Authentication
    auth: authReducer,

    // Student
    student: studentReducer,

    // Feedback
    feedback: feedbackReducer,

    // Complaints
    complaint: complaintReducer,

    // Voting
    vote: voteReducer,

    // Menu
    menu: menuReducer,

    // Meal
    meal: mealReducer,
  },
});