import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  announcements: [],
  loading: false,
  error: null,
};

const announcementSlice = createSlice({
  name: "announcement",
  initialState,

  reducers: {
    setAnnouncements: (state, action) => {
      state.announcements = action.payload;
    },

    addAnnouncement: (state, action) => {
      state.announcements.unshift(action.payload);
    },

    removeAnnouncement: (state, action) => {
      state.announcements = state.announcements.filter(
        (announcement) => announcement.id !== action.payload
      );
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
  setAnnouncements,
  addAnnouncement,
  removeAnnouncement,
  setLoading,
  setError,
} = announcementSlice.actions;

export default announcementSlice.reducer;