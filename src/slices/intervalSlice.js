import { createSlice } from "@reduxjs/toolkit";

const intervalSlice = createSlice({
  name: "interval",
  initialState: 0,
  reducers: {
    setIntervalId(_state, action) {
      return action.payload;
    },
    clearIntervalId() {
      return 0;
    },
  },
});

export const { setIntervalId, clearIntervalId } = intervalSlice.actions;
export default intervalSlice.reducer;
