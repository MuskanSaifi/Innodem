// store/wishlistSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from 'react-hot-toast'; // Import toast

// Async Thunks for API calls
export const fetchUserWishlist = createAsyncThunk(
  "wishlist/fetchUserWishlist",
  async (_, { rejectWithValue, getState }) => {
    try {
      // Get token from Redux store (userSlice)
      const token = getState().user.token;
      if (!token) {
        // No toast for this, as it's typically handled by a login redirect or message
        return rejectWithValue("No authentication token found.");
      }

      const response = await axios.get("/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.wishlist || [];
    } catch (error) {
      console.error("❌ Error fetching user wishlist:", error);
      // toast.error("Failed to load wishlist."); // Optional: You could show a toast here too
      return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist");
    }
  }
);

export const addProductToWishlist = createAsyncThunk(
  "wishlist/addProductToWishlist",
  async (productId, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      if (!token) {
        toast.error("Please log in to add to wishlist."); // Inform user to log in
        return rejectWithValue("No authentication token found.");
      }

      const response = await axios.post(
        "/api/wishlist",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Product added to wishlist!"); // Success toast
      return response.data.wishlist;
    } catch (error) {
      console.error("❌ Error adding product to wishlist:", error);
      const errorMessage = error.response?.data?.message || "Failed to add product to wishlist";
      toast.error(errorMessage); // Error toast
      return rejectWithValue(errorMessage);
    }
  }
);

export const removeProductFromWishlist = createAsyncThunk(
  "wishlist/removeProductFromWishlist",
  async (productId, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      if (!token) {
        toast.error("Please log in to remove from wishlist."); // Inform user to log in
        return rejectWithValue("No authentication token found.");
      }

      const response = await axios.delete(`/api/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Product removed from wishlist!"); // Success toast
      return response.data.wishlist;
    } catch (error) {
      console.error("❌ Error removing product from wishlist:", error);
      const errorMessage = error.response?.data?.message || "Failed to remove product from wishlist";
      toast.error(errorMessage); // Error toast
      return rejectWithValue(errorMessage);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
      state.loading = false;
      toast.success("Wishlist cleared!"); // Optional: Toast for clearing wishlist on logout
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchUserWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUserWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Product to Wishlist
      .addCase(addProductToWishlist.pending, (state) => {
        // You might consider a toast for 'Adding...' here, but often 'success' is enough.
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addProductToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove Product from Wishlist
      .addCase(removeProductFromWishlist.pending, (state) => {
        // You might consider a toast for 'Removing...' here.
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProductFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(removeProductFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;