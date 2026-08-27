import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reportService from "../../services/reportService";

// ============================================================
// GET BOOKING REPORT
// ============================================================

export const getBookingReport = createAsyncThunk(
  "reports/getBookingReport",

  async (params = {}, { rejectWithValue }) => {
    try {
      console.log("Fetching booking report...", params);

      const response =
        await reportService.bookingReport(params);

      console.log(
        "Booking Report API Response:",
        response
      );

      return response.data;
    } catch (error) {
      console.log(
        "Booking Report Error:",
        error
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch booking report."
      );
    }
  }
);

// ============================================================
// GET REVENUE REPORT
// ============================================================

export const getRevenueReport = createAsyncThunk(
  "reports/getRevenueReport",

  async (params = {}, { rejectWithValue }) => {
    try {
      console.log("Fetching revenue report...", params);

      const response =
        await reportService.revenueReport(params);

      console.log(
        "Revenue Report API Response:",
        response
      );

      return response.data;
    } catch (error) {
      console.log(
        "Revenue Report Error:",
        error
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch revenue report."
      );
    }
  }
);

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  bookingReports: null,
  revenueReports: null,

  loading: false,
  error: null,
};

// ============================================================
// SLICE
// ============================================================

const reportSlice = createSlice({
  name: "reports",

  initialState,

  reducers: {
    clearReportError: (state) => {
      state.error = null;
    },

    clearReports: (state) => {
      state.bookingReports = null;
      state.revenueReports = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ========================================================
    // BOOKING REPORT
    // ========================================================

    builder
      .addCase(
        getBookingReport.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getBookingReport.fulfilled,
        (state, action) => {
          state.loading = false;

          state.bookingReports =
            action.payload;

          state.error = null;
        }
      )

      .addCase(
        getBookingReport.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch booking report.";
        }
      )

      // ======================================================
      // REVENUE REPORT
      // ======================================================

      .addCase(
        getRevenueReport.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getRevenueReport.fulfilled,
        (state, action) => {
          state.loading = false;

          state.revenueReports =
            action.payload;

          state.error = null;
        }
      )

      .addCase(
        getRevenueReport.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch revenue report.";
        }
      );
  },
});

export const {
  clearReportError,
  clearReports,
} = reportSlice.actions;

export default reportSlice.reducer;