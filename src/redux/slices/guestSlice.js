import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import guestService from "../../services/guestService";

// ============================================================
// GET GUESTS
// ============================================================

export const getGuests = createAsyncThunk(
  "guests/getGuests",
  async (_, { rejectWithValue }) => {
    try {
        console.log("Fetching guests...");
      const response = await guestService.getGuests();

      return response;
    } catch (error) {
        console.log("Error fetching guests:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch guests."
      );
    }
  }
);

// ============================================================
// CREATE GUEST
// ============================================================

export const createGuest = createAsyncThunk(
  "guests/createGuest",

  async (guestData, { rejectWithValue }) => {
    try {
      const response =
        await guestService.createGuest(guestData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create guest."
      );
    }
  }
);

// ============================================================
// UPDATE GUEST
// ============================================================

export const updateGuest = createAsyncThunk(
  "guests/updateGuest",

  async ({ id, guestData }, { rejectWithValue }) => {
    try {
      const response = await guestService.updateGuest(id, guestData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update guest."
      );
    }
  }
);

// ============================================================
// DELETE GUEST
// ============================================================

export const deleteGuest = createAsyncThunk(
  "guests/deleteGuest",

  async (id, { rejectWithValue }) => {
    try {
      const response = await guestService.deleteGuest(id);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete guest."
      );
    }
  }
);

// ============================================================
// INITIAL STATE
// ============================================================

const storedUser = localStorage.getItem("hotel_user");

const initialState = {
  guests: [],
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

const guestSlice = createSlice({
  name: "guests",

  initialState,

  reducers: {
    logout: (state) => {
      state.guests = null;
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
      .addCase(getGuests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getGuests.fulfilled, (state, action) => {
        state.loading = false;
        state.guests = action.payload;
      })

      .addCase(getGuests.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to fetch guests.";
      });

      // ============================================================
// createGuest
// ============================================================

builder
  .addCase(createGuest.pending, (state) => {
    state.loading = true;
    state.error = null;
  })

  .addCase(createGuest.fulfilled, (state, action) => {
    state.loading = false;
    state.error = null;
    state.guests = action.payload;
  })

  .addCase(createGuest.rejected, (state, action) => {
    state.loading = false;

    state.error =
      action.payload ||
      "Failed to create guest";
  });

    // --------------------------------------------------------
    // updateGuest
    // --------------------------------------------------------

    builder
      .addCase(updateGuest.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateGuest.fulfilled, (state, action) => {
        state.loading = false;
        state.guests = action.payload;
      })

      .addCase(updateGuest.rejected, (state) => {
        state.loading = false;
      });

    // --------------------------------------------------------
    // deleteGuest
    // -------------------------------------------------------- 
    builder.addCase(deleteGuest.pending, (state) => {
      state.loading = true;
    })

    .addCase(deleteGuest.fulfilled, (state, action) => {
      state.loading = false;
      state.guests = action.payload;
    });
  },
});

export const {
  logout,
  clearAuthError,
} = guestSlice.actions;

export default guestSlice.reducer;