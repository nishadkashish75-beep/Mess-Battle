import { configureStore } from "@reduxjs/toolkit";

import adminReducer from "../features/admin/adminSlice";
import announcementReducer from "../features/announcements/announcementSlice";
import analyticsReducer from "../features/analytics/analyticsSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    announcement: announcementReducer,
    analytics: analyticsReducer,
  },
});