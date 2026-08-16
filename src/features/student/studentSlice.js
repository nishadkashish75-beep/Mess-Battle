import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  notifications: [],
};

const studentSlice = createSlice({
  name: "student",
  initialState,

  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },

    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },

    clearProfile: (state) => {
      state.profile = null;
    },
  },
});

export const { setProfile, setNotifications,clearProfile } = studentSlice.actions;

export default studentSlice.reducer;