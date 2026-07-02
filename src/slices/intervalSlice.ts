import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const intervalSlice = createSlice({
	name: "interval",
	initialState: 0 as number,
	reducers: {
		setIntervalId(_state, action: PayloadAction<number>) {
			return action.payload;
		},
		clearIntervalId() {
			return 0;
		},
	},
});

export const { setIntervalId, clearIntervalId } = intervalSlice.actions;
export default intervalSlice.reducer;
