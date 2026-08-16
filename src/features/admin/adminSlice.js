import {createSlice} from "@reduxjs/toolkit";
const initialState = {
  users: [],
  complaints: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,

  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },

    setComplaints: (state, action) => {
      state.complaints = action.payload;
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
  setUsers,
  setComplaints,
  setLoading,
  setError,
} = adminSlice.actions;

export default adminSlice.reducer;