import { configureStore } from "@reduxjs/toolkit";

// Auth
import authReducer from "../features/auth/authSlice";
import studentReducer from "../features/student/studentSlice";

// Student features
import feedbackReducer from "../features/feedback/feedbackSlice";
import complaintReducer from "../features/complaints/complaintSlice";
import voteReducer from "../features/voting/voteSlice";

// Menu and meals
import menuReducer from "../features/menu/menuSlice";
import mealReducer from "../features/meals/mealSlice";

// Admin features
import adminReducer from "../features/admin/adminSlice";
import announcementReducer from "../features/announcements/announcementSlice";
import analyticsReducer from "../features/analytics/analyticsSlice";

export const store = configureStore({
  reducer: {
    // Authentication
    auth: authReducer,

    // Student
    student: studentReducer,

    // Student features
    feedback: feedbackReducer,
    complaint: complaintReducer,
    vote: voteReducer,

    // Menu & meals
    menu: menuReducer,
    meal: mealReducer,

    // Admin
    admin: adminReducer,
    announcement: announcementReducer,
    analytics: analyticsReducer,
  },
});