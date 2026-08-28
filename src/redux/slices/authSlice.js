import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/authService";

// ============================================================
// LOGIN
// ============================================================

export const loginUser = createAsyncThunk(
  "auth/loginUser",

  async (loginData, { rejectWithValue }) => {
    try {
      const response = await authService.login(loginData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  }
);

// ============================================================
// REGISTER
// ============================================================

export const registerUser = createAsyncThunk(
  "auth/registerUser",

  async (registerData, { rejectWithValue }) => {
    try {
      const response =
        await authService.register(registerData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  }
);

// ============================================================
// GET PROFILE
// ============================================================

export const getProfile = createAsyncThunk(
  "auth/getProfile",

  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getProfile();

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch profile."
      );
    }
  }
);

// ============================================================
// CHANGE PASSWORD
// ============================================================

export const changePassword = createAsyncThunk(
  "auth/changePassword",

  async (passwordData, { rejectWithValue }) => {
    try {
      const response =
        await authService.changePassword(passwordData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Password change failed. Please try again."
      );
    }
  });


// ============================================================
// get housekeeping staff
// ============================================================

export const getHousekeepingStaff = createAsyncThunk(
  "housekeeping/getHousekeepingStaff",

  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getHousekeepingStaff();

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch housekeeping staff."
      );
    }
  }
);

// ============================================================
// forgot PASSWORD
// ============================================================

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",

  async (forgotPasswordData, { rejectWithValue }) => {
    try {
      const response =
        await authService.forgotPassword(forgotPasswordData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Forgot Password failed. Please try again."
      );
    }
  });

  // ============================================================
// verify forgot PASSWORD otp
// ============================================================

export const verifyForgotPasswordOtp = createAsyncThunk(
  "auth/verifyForgotPasswordOtp",

  async (forgotPasswordOtpData, { rejectWithValue }) => {
    try {
      const response =
        await authService.verifyforgotPasswordOtp(forgotPasswordOtpData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Verify Password otp failed. Please try again."
      );
    }
  });

  // ============================================================
// reset PASSWORD
// ============================================================

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",

  async (resetPasswordData, { rejectWithValue }) => {
    try {
      const response =
        await authService.resetPassword(resetPasswordData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Reset Password change failed. Please try again."
      );
    }
  });

// ============================================================
// INITIAL STATE
// ============================================================

const storedUser = localStorage.getItem("hotel_user");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,

  token: localStorage.getItem("hotel_token") || null,

  data:null,

  isAuthenticated: Boolean(
    localStorage.getItem("hotel_token")
  ),

  loading: false,

  error: null,
};



// ============================================================
// SLICE
// ============================================================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.data = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("hotel_token");
      localStorage.removeItem("hotel_user");
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
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        /*
          Supports common backend responses such as:

          {
            success: true,
            token: "...",
            user: {...}
          }

          OR

          {
            success: true,
            data: {
              token: "...",
              user: {...}
            }
          }
        */

        const response = action.payload;

        const token =
          response.token ||
          response.data?.token ||
          response.accessToken ||
          response.data?.accessToken;

        const user =
          response.user ||
          response.data?.user ||
          response.data;

        state.token = token;
        state.user = user;
        state.isAuthenticated = Boolean(token);

        if (token) {
          localStorage.setItem("hotel_token", token);
        }

        if (user) {
          localStorage.setItem(
            "hotel_user",
            JSON.stringify(user)
          );
        }
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Login failed";
      });

      // ============================================================
// REGISTER
// ============================================================

builder
  .addCase(registerUser.pending, (state) => {
    state.loading = true;
    state.error = null;
  })

  .addCase(registerUser.fulfilled, (state) => {
    state.loading = false;
    state.error = null;
  })

  .addCase(registerUser.rejected, (state, action) => {
    state.loading = false;

    state.error =
      action.payload ||
      "Registration failed";
  });

    // --------------------------------------------------------
    // PROFILE
    // --------------------------------------------------------

    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })

      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;

        const response = action.payload;

        const user =
          response.user ||
          response.data?.user ||
          response.data;

        if (user) {
          state.user = user;

          localStorage.setItem(
            "hotel_user",
            JSON.stringify(user)
          );
        }
      })

      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
      });

      // ============================================================
// CHANGE PASSWORD
// ============================================================
      builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Password change failed. Please try again.";
      });

    // --------------------------------------------------------
    // housekeeping staff
    // --------------------------------------------------------
    builder.addCase(getHousekeepingStaff.pending, (state) => {
      state.loading = true;
    })

    .addCase(getHousekeepingStaff.fulfilled, (state, action) => {
      state.loading = false;
      state.housekeepingStaff = action.payload;
    })

    .addCase(getHousekeepingStaff.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ||
        "Failed to fetch housekeeping staff.";
    });
    // ============================================================
// forgot PASSWORD
// ============================================================
      builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
        state.message = action.payload.message; // Assuming
      })

      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Password change failed. Please try again.";
      });

      // ============================================================
// reset PASSWORD
// ============================================================
      builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
        state.message = action.payload.message; // Assuming
      })

      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Password change failed. Please try again.";
      });
      // ============================================================
// verify forgot PASSWORD otp
// ============================================================
      builder
      .addCase(verifyForgotPasswordOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(verifyForgotPasswordOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
        state.message = action.payload.message; // Assuming
      })

      .addCase(verifyForgotPasswordOtp.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Password change failed. Please try again.";
      });
  },
});

export const {
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;