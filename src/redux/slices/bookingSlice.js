import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bookingService from "../../services/bookingService";

// ============================================================
// GET BOOKINGS
// ============================================================

export const getBookings = createAsyncThunk(
  "bookings/getBookings",
  async (_, { rejectWithValue }) => {
    try {
        console.log("Fetching getbookings...");
      const response = await bookingService.getBookings();

      return response;
    } catch (error) {
        console.log("Error fetching bookings:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch bookings."
      );
    }
  }
);

// ============================================================
// CREATE BOOKING
// ============================================================

export const createBooking = createAsyncThunk(
  "bookings/createBooking",

  async (bookingData, { rejectWithValue }) => {
    try {
      const response =
        await bookingService.createBooking(bookingData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create booking."
      );
    }
  }
);

// ============================================================
// UPDATE BOOKING
// ============================================================

export const updateBooking = createAsyncThunk(
  "bookings/updateBooking",

  async ({ id, bookingData }, { rejectWithValue }) => {
    try {
      const response = await bookingService.updateBooking(id, bookingData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update booking."
      );
    }
  }
);

// ============================================================
// DELETE BOOKING
// ============================================================

export const deleteBooking = createAsyncThunk(
  "bookings/deleteBooking",

  async (id, { rejectWithValue }) => {
    try {
      const response = await bookingService.deleteBooking(id);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete booking."
      );
    }
  }
);

// ============================================================
// INITIAL STATE
// ============================================================

const storedUser = localStorage.getItem("hotel_user");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,

  token: localStorage.getItem("hotel_token") || null,

  isAuthenticated: Boolean(
    localStorage.getItem("hotel_token")
  ),

  loading: false,

  error: null,
};

// ============================================================
// SLICE
// ============================================================

const bookingSlice = createSlice({
  name: "bookings",

  initialState,

  reducers: {
    logout: (state) => {
      state.bookings = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // --------------------------------------------------------
    // LOGIN
    // --------------------------------------------------------

    builder
      .addCase(getBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getBookings.fulfilled, (state, action) => {
        console.log("getBookings fulfilled:", action.payload);
        state.loading = false;
        state.bookings = action.payload;
      })

      .addCase(getBookings.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to fetch bookings.";
      });

      // ============================================================
// createBooking
// ============================================================

builder
  .addCase(createBooking.pending, (state) => {
    state.loading = true;
    state.error = null;
  })

  .addCase(createBooking.fulfilled, (state, action) => {
    state.loading = false;
    state.error = null;
    state.bookings = action.payload;
  })

  .addCase(createBooking.rejected, (state, action) => {
    state.loading = false;

    state.error =
      action.payload ||
      "Failed to create booking";
  });

    // --------------------------------------------------------
    // updateBooking
    // --------------------------------------------------------

    builder
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })

      .addCase(updateBooking.rejected, (state) => {
        state.loading = false;
      });

    // --------------------------------------------------------
    // deleteBooking
    // -------------------------------------------------------- 
    builder.addCase(deleteBooking.pending, (state) => {
      state.loading = true;
    })

    .addCase(deleteBooking.fulfilled, (state, action) => {
      state.loading = false;
      state.bookings = action.payload;
    });
  },
});

export const {
  logout,
  clearAuthError,
} = bookingSlice.actions;

export default bookingSlice.reducer;