import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feedbacks: [],
  loading: false,
  error: null,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    setFeedbacks: (state, action) => {
      state.feedbacks = action.payload;
    },

    addFeedback: (state, action) => {
      state.feedbacks.push(action.payload);
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFeedbacks,
  addFeedback,
  setLoading,
  setError,
} = feedbackSlice.actions;

export default feedbackSlice.reducer;