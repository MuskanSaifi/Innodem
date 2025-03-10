import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async (subcategory, { rejectWithValue }) => {
      try {
        const response = await axios.get(`/api/products?subcategory=${encodeURIComponent(subcategory)}`);
        return response.data.products;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch products");
      }
    }
  );
  

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    filteredProducts: [],
    loading: false,
    error: null,
    filters: {
      priceRange: [0, 100000], // Default price range
      time: "", // Default time filter
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };

      // ✅ Apply filters to products
      state.filteredProducts = state.products.filter((product) => {
        const { priceRange, time } = state.filters;

        // ✅ Filter by Price Range
        const isWithinPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];

        // ✅ Filter by Time (if applicable)
        const isTimeMatch = time ? product.addedTime?.includes(time) : true;

        return isWithinPriceRange && isTimeMatch;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.filteredProducts = action.payload; // Initially set filtered products
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters } = productSlice.actions;
export default productSlice.reducer;
