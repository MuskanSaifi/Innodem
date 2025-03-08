import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./categorySlice"; // ✅ Import category reducer
import productReducer from "./productSlice";

export const store = configureStore({
  reducer: {
    categories: categoryReducer, // ✅ Add category slice to store
    products: productReducer,  // ✅ Add productSlice to store

  },
});
