import { configureStore } from "@reduxjs/toolkit";
import cellsReducer from "./slices/cellsSlice";
import generationsReducer from "./slices/generationsSlice";
import intervalReducer from "./slices/intervalSlice";

const store = configureStore({
  reducer: {
    cells: cellsReducer,
    generations: generationsReducer,
    interval: intervalReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
