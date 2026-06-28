import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      counter: counterReducer,
    },
  });
}
