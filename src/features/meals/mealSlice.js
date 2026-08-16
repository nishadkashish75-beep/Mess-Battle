import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  meals: [],
  attendance: {},
  loading: false,
  error: null,
};

const mealSlice = createSlice({
  name: "meal",

  initialState,

  reducers: {

    setMeals: (state, action) => {
      state.meals = action.payload;
    },

    addMeal: (state, action) => {
      state.meals.push(action.payload);
    },

    setAttendance: (state, action) => {
      state.attendance = action.payload;
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
  setMeals,
  addMeal,
  setAttendance,
  setLoading,
  setError,
} = mealSlice.actions;

export default mealSlice.reducer;