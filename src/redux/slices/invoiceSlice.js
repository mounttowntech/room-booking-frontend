import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import invoiceService from "../../services/invoiceService";

// ============================================================
// GET INVOICES
// ============================================================

export const getAllInvoices = createAsyncThunk(
  "invoices/getAllInvoices",
  async (_, { rejectWithValue }) => {
    try {
        console.log("Fetching all invoices...");
      const response = await invoiceService.getInvoices();

      return response;
    } catch (error) {
        console.log("Error fetching all invoices:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch all invoices."
      );
    }
  }
);

// ============================================================
// GET INVOICES BY ID
// ============================================================

export const getInvoiceById = createAsyncThunk(
  "invoices/getInvoiceById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await invoiceService.getInvoiceById(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch invoice."
      );
    }
  }
);

// ============================================================
    // GET INVOICE BY BOOKING
    // ============================================================

export const getInvoiceByBooking = createAsyncThunk(
  "invoices/getInvoiceByBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await invoiceService.getInvoiceByBooking(bookingId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch invoice by booking."
      );
    }
    });


// ============================================================
// CREATE INVOICE
// ============================================================

export const createInvoice = createAsyncThunk(
  "invoices/createInvoice",

  async (invoiceData, { rejectWithValue }) => {
    try {
      const response =
        await invoiceService.createInvoice(invoiceData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create invoice."
      );
    }
  }
);

// ============================================================
// UPDATE INVOICE
// ============================================================

export const updateInvoice = createAsyncThunk(
  "invoices/updateInvoice",

  async ({ id, invoiceData }, { rejectWithValue }) => {
    try {
      const response = await invoiceService.updateInvoice(id, invoiceData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update invoice."
      );
    }
  }
);

// ============================================================
// DELETE INVOICE
// ============================================================

export const deleteInvoice = createAsyncThunk(
  "invoices/deleteInvoice",

  async (id, { rejectWithValue }) => {
    try {
      const response = await invoiceService.deleteInvoice(id);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete invoice."
      );
    }
  }
);


// ============================================================
// CANCEL INVOICE
// ============================================================

export const cancelInvoice = createAsyncThunk(
  "invoices/cancelInvoice",

  async ({id, reason}, { rejectWithValue }) => {
    try {
      console.log("Cancelling invoice with ID:", id, "Reason:", reason);
      const response = await invoiceService.cancelInvoice({id, reason});

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to cancel invoice."
      );
    }
  }
);


// ============================================================
// INITIAL STATE
// ============================================================

const storedUser = localStorage.getItem("hotel_user");

const initialState = {
    invoices: [],
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

const invoiceSlice = createSlice({
  name: "invoices",

  initialState,

  reducers: {
    logout: (state) => {
      state.invoices = [];
      state.invoice = null;
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
    // get all invoices
    // --------------------------------------------------------

    builder.addCase(getAllInvoices.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(getAllInvoices.fulfilled, (state, action) => {
        console.log("getAllInvoices fulfilled:", action.payload);
      state.loading = false;
        state.invoices = action.payload?.data ||
        action.payload?.data ||
    [];
    })

    .addCase(getAllInvoices.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ||
        "Failed to fetch all invoices.";
    });

    // --------------------------------------------------------
    // get invoice by id
    // --------------------------------------------------------

    builder.addCase(getInvoiceById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(getInvoiceById.fulfilled, (state, action) => {
      state.loading = false;
      state.invoice = action.payload;
    })

    .addCase(getInvoiceById.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ||
        "Failed to fetch invoice.";
    });




    // --------------------------------------------------------
    // get invoice by booking
    // --------------------------------------------------------

    builder
      .addCase(getInvoiceByBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getInvoiceByBooking.fulfilled, (state, action) => {
        console.log("getInvoiceByBooking fulfilled:", action.payload);
        state.loading = false;
        state.invoice = action.payload;
      })

      .addCase(getInvoiceByBooking.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to fetch invoice by booking.";
      });

      // ============================================================
// createInvoice
// ============================================================

builder
  .addCase(createInvoice.pending, (state) => {
    state.loading = true;
    state.error = null;
  })

  .addCase(createInvoice.fulfilled, (state, action) => {
    state.loading = false;
    state.error = null;
    state.invoice = action.payload;
  })

  .addCase(createInvoice.rejected, (state, action) => {
    state.loading = false;

    state.error =
      action.payload ||
      "Failed to create invoice";
  });

    // --------------------------------------------------------
    // updateInvoice
    // --------------------------------------------------------

    builder
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoice = action.payload;
      })

      .addCase(updateInvoice.rejected, (state) => {
        state.loading = false;
      });

    // --------------------------------------------------------
    // deleteInvoice
    // -------------------------------------------------------- 
    builder.addCase(deleteInvoice.pending, (state) => {
      state.loading = true;
    })

    .addCase(deleteInvoice.fulfilled, (state, action) => {
      state.loading = false;
      state.invoice = action.payload;
    });

    // --------------------------------------------------------
    // cancel Invoice
    // -------------------------------------------------------- 
    builder.addCase(cancelInvoice.pending, (state) => {
      state.loading = true;
    }).addAsyncThunk(cancelInvoice.fulfilled, (state, action) => {
      state.loading = false;
      state.invoice = action.payload;
    }).addAsyncThunk(cancelInvoice.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const {
  logout,
  clearAuthError,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;