import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dashboardService from "../../services/dashboardService";

// ============================================================
// GET DASHBOARD DATA
// ============================================================

export const getDashboardData = createAsyncThunk(
  "dashboard/getDashboardData",
  async (_, { rejectWithValue }) => {
    try {
        console.log("Fetching dashboard data...");
      const response = await dashboardService.getDashboardData();

      return response;
    } catch (error) {
        console.log("Error fetching dashboard data:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch dashboard data."
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

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {
    logout: (state) => {
      state.dashboardData = null;
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
      .addCase(getDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getDashboardData.fulfilled, (state, action) => {
        console.log("getDashboardData fulfilled:", action.payload);
        state.loading = false;
        state.dashboardData = action.payload;
      })

      .addCase(getDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to fetch dashboard data.";
      });
  },
});

export const {
  logout,
  clearAuthError,
} = dashboardSlice.actions
export default dashboardSlice.reducer;