import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import paymentService from "../../services/paymentService";

// ============================================================
// GET PAYMENTS
// ============================================================

export const getPayments = createAsyncThunk(
  "payments/getPayments",
  async (_, { rejectWithValue }) => {
    try {
        console.log("Fetching getpayments...");
      const response = await paymentService.getPayments();

      return response;
    } catch (error) {
        console.log("Error fetching payments:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch payments."
      );
    }
  }
);

// ============================================================
// GET PAYMENT SUMMARY
// ============================================================

export const getPaymentSummary = createAsyncThunk(
  "payments/getPaymentSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentService.getPaymentSummary();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch payment summary."
      );
    }
  }
);

// ============================================================
// CREATE PAYMENT
// ============================================================

export const createPayment = createAsyncThunk(
  "payments/createPayment",

  async (paymentData, { rejectWithValue }) => {
    try {
      const response =
        await paymentService.createPayment(paymentData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create payment."
      );
    }
  }
);

// ============================================================
// UPDATE PAYMENT
// ============================================================

export const updatePayment = createAsyncThunk(
  "payments/updatePayment",

  async ({ id, paymentData }, { rejectWithValue }) => {
    try {
      const response = await paymentService.updatePayment(id, paymentData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update payment."
      );
    }
  }
);

// ============================================================
// DELETE PAYMENT
// ============================================================

export const deletePayment = createAsyncThunk(
  "payments/deletePayment",

  async (id, { rejectWithValue }) => {
    try {
      const response = await paymentService.deletePayment(id);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete payment."
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

const paymentSlice = createSlice({
  name: "payments",

  initialState,

  reducers: {
    logout: (state) => {
      state.payments = null;
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
      .addCase(getPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getPayments.fulfilled, (state, action) => {
        console.log("getPayments fulfilled:", action.payload);
        state.loading = false;
        state.payments = action.payload;
      })

      .addCase(getPayments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to fetch payments.";
      });

      // ============================================================
// createPayment
// ============================================================

builder
  .addCase(createPayment.pending, (state) => {
    state.loading = true;
    state.error = null;
  })

  .addCase(createPayment.fulfilled, (state, action) => {
    state.loading = false;
    state.error = null;
    state.payments = action.payload;
  })

  .addCase(createPayment.rejected, (state, action) => {
    state.loading = false;

    state.error =
      action.payload ||
      "Failed to create payment";
  });

    // --------------------------------------------------------
    // updatePayment
    // --------------------------------------------------------

    builder
      .addCase(updatePayment.pending, (state) => {
        state.loading = true;
      })

      .addCase(updatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })

      .addCase(updatePayment.rejected, (state) => {
        state.loading = false;
      });

    // --------------------------------------------------------
    // deletePayment
    // -------------------------------------------------------- 
    builder.addCase(deletePayment.pending, (state) => {
      state.loading = true;
    })

    .addCase(deletePayment.fulfilled, (state, action) => {
      state.loading = false;
      state.payments = action.payload;
    });

    // ============================================================
    // getPaymentSummary
    // ============================================================
    builder
      .addCase(getPaymentSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentSummary = action.payload;
      })
      .addCase(getPaymentSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  logout,
  clearAuthError,
} = paymentSlice.actions;

export default paymentSlice.reducer;