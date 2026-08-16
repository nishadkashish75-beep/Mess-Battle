import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ratings: [],
  demand: [],
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,

  reducers: {
    setRatings: (state, action) => {
      state.ratings = action.payload;
    },

    setDemand: (state, action) => {
      state.demand = action.payload;
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
  setRatings,
  setDemand,
  setLoading,
  setError,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;