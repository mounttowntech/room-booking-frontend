import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import roomService from "../../services/roomService";

// ============================================================
// GET ROOMS
// ============================================================

export const getRooms = createAsyncThunk(
  "rooms/getRooms",
  async (_, { rejectWithValue }) => {
    try {
        console.log("Fetching getrooms...");
      const response = await roomService.getRooms();

      return response;
    } catch (error) {
        console.log("Error fetching rooms:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch rooms."
      );
    }
  }
);

// ============================================================
// CREATE ROOM
// ============================================================

export const createRoom = createAsyncThunk(
  "rooms/createRoom",

  async (roomData, { rejectWithValue }) => {
    try {
      const response =
        await roomService.createRoom(roomData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create room."
      );
    }
  }
);

// ============================================================
// UPDATE ROOM
// ============================================================

export const updateRoom = createAsyncThunk(
  "rooms/updateRoom",

  async ({ id, roomData }, { rejectWithValue }) => {
    try {
      const response = await roomService.updateRoom(id, roomData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update room."
      );
    }
  }
);

// ============================================================
// DELETE ROOM
// ============================================================

export const deleteRoom = createAsyncThunk(
  "rooms/deleteRoom",

  async (id, { rejectWithValue }) => {
    try {
      const response = await roomService.deleteRoom(id);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete room."
      );
    }
  }
);

// ============================================================
// INITIAL STATE
// ============================================================

const storedUser = localStorage.getItem("hotel_user");

const initialState = {
  rooms: [],
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

const roomSlice = createSlice({
  name: "rooms",

  initialState,

  reducers: {
    logout: (state) => {
      state.rooms = null;
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
      .addCase(getRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })

      .addCase(getRooms.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to fetch rooms.";
      });

      // ============================================================
// createRoom
// ============================================================

builder
  .addCase(createRoom.pending, (state) => {
    state.loading = true;
    state.error = null;
  })

  .addCase(createRoom.fulfilled, (state, action) => {
    state.loading = false;
    state.error = null;
    state.rooms = action.payload;
  })

  .addCase(createRoom.rejected, (state, action) => {
    state.loading = false;

    state.error =
      action.payload ||
      "Failed to create room";
  });

    // --------------------------------------------------------
    // updateRoom
    // --------------------------------------------------------

    builder
      .addCase(updateRoom.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })

      .addCase(updateRoom.rejected, (state) => {
        state.loading = false;
      });

    // --------------------------------------------------------
    // deleteRoom
    // -------------------------------------------------------- 
    builder.addCase(deleteRoom.pending, (state) => {
      state.loading = true;
    })

    .addCase(deleteRoom.fulfilled, (state, action) => {
      state.loading = false;
      state.rooms = action.payload;
    });
  },
});

export const {
  logout,
  clearAuthError,
} = roomSlice.actions;

export default roomSlice.reducer;