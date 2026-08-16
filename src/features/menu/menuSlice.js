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
    // SET ALL MENUS
    setMenus: (state, action) => {
      state.menus = action.payload;
    },

    // ADD MENU
    addMenu: (state, action) => {
      state.menus.push(action.payload);
    },

    // UPDATE MENU
    updateMenu: (state, action) => {
      const updatedMenu = action.payload;

      const index = state.menus.findIndex(
        (menu) => menu.id === updatedMenu.id
      );

      if (index !== -1) {
        state.menus[index] = updatedMenu;
      }
    },

    // DELETE MENU
    deleteMenu: (state, action) => {
      state.menus = state.menus.filter(
        (menu) => menu.id !== action.payload
      );
    },

    // LOADING
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // ERROR
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