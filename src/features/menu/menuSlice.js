import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  menus: [],
  loading: false,
  error: null,
};

const menuSlice = createSlice({
  name: "menu",

  initialState,

  reducers: {
    setMenus: (state, action) => {
      state.menus = action.payload;
    },

    addMenu: (state, action) => {
      state.menus.push(action.payload);
    },

    updateMenu: (state, action) => {
      const index = state.menus.findIndex(
        (menu) => menu.id === action.payload.id
      );

      if (index !== -1) {
        state.menus[index] = action.payload;
      }
    },

    deleteMenu: (state, action) => {
      state.menus = state.menus.filter(
        (menu) => menu.id !== action.payload
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
  setMenus,
  addMenu,
  updateMenu,
  deleteMenu,
  setLoading,
  setError,
} = menuSlice.actions;

export default menuSlice.reducer;