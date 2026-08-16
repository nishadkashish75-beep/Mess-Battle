import { configureStore } from "@reduxjs/toolkit";

import feedbackReducer from "../features/feedback/feedbackSlice";
import complaintReducer from "../features/complaints/complaintSlice";
import voteReducer from "../features/voting/voteSlice";

export const store = configureStore({
  reducer: {
    feedback: feedbackReducer,
    complaint: complaintReducer,
    vote: voteReducer,
  },
});