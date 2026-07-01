import { createSlice } from "@reduxjs/toolkit";

const generationsSlice = createSlice({
  name: "generations",
  initialState: 0,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase("cells/makeGrid", () => 0)
      .addCase("cells/makeRandomGrid", () => 0)
      .addCase("cells/stepForward", (state) => state + 1);
  },
});

export default generationsSlice.reducer;
