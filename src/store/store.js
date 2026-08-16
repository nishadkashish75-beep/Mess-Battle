import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import studentReducer from "../features/student/studentSlice";

import feedbackReducer from "../features/feedback/feedbackSlice";
import complaintReducer from "../features/complaints/complaintSlice";
import voteReducer from "../features/voting/voteSlice";

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
  },
});