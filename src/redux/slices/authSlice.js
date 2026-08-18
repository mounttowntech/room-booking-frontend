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

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
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
  },
});

export const {
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;