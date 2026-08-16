import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  votes: [],
  loading: false,
  error: null,
};

const voteSlice = createSlice({
  name: "vote",

  initialState,

  reducers: {
    setVotes: (state, action) => {
      state.votes = action.payload;
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
  setVotes,
  setLoading,
  setError,
} = voteSlice.actions;

export default voteSlice.reducer;