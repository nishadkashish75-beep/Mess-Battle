import { configureStore } from "@reduxjs/toolkit";

import menuReducer from "../features/menu/menuSlice";
import mealReducer from "../features/meals/mealSlice";


export const store = configureStore({
  reducer: {
    menu: menuReducer,
    meal: mealReducer,
  },
});