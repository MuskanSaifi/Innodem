import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Async function to fetch products by subcategory
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (subcategory, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/products?subcategory=${encodeURIComponent(subcategory)}`);

      if (!response.data || response.status !== 200) {
        throw new Error("Invalid response from server");
      }

      console.log("📌 API Response:", response.data); // ✅ Debugging API response

      return response.data; // API returns an array, not { products: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch products");
    }
  }
);

// ✅ Redux Slice
const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [], // Stores all products
    filteredProducts: [], // Stores filtered products (same as products initially)
    loading: false,
    error: null,
  },
  reducers: {}, // Add reducers here if needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("🕒 Fetching products...");
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // ✅ API returns array, assign directly
        state.filteredProducts = action.payload; // ✅ Ensure filteredProducts is set
        console.log("✅ Products Fetched:", action.payload); // ✅ Debugging
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("❌ Error Fetching Products:", action.payload); // ✅ Log errors
      });
  },
});

export default productSlice.reducer;
