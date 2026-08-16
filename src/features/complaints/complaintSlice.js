import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  complaints: [],
  loading: false,
  error: null,
};

const complaintSlice = createSlice({
  name: "complaint",
  initialState,

  reducers: {
    setComplaints: (state, action) => {
      state.complaints = action.payload;
    },

    addComplaint: (state, action) => {
      state.complaints.push(action.payload);
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
  setComplaints,
  addComplaint,
  setLoading,
  setError,
} = complaintSlice.actions;

export default complaintSlice.reducer;