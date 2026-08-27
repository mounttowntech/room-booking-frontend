import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import houseKeepingService from "../../services/housekeepingService";

// ============================================================
// GET HOUSEKEEPING TASKS
// ============================================================

export const getHousekeepingTasks = createAsyncThunk(
  "housekeeping/getHousekeepingTasks",
  async (_, { rejectWithValue }) => {
    try {
        console.log("Fetching all housekeeping tasks...");
      const response = await houseKeepingService.getTasks();

      return response;
    } catch (error) {
        console.log("Error fetching all housekeeping tasks:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch all housekeeping tasks."
      );
    }
  }
);

// ============================================================
// CREATE HOUSEKEEPING TASK
// ============================================================

export const createTask = createAsyncThunk(
  "housekeeping/createTask",

  async (taskData, { rejectWithValue }) => {
    try {
      const response =
        await houseKeepingService.createTask(taskData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create housekeeping task."
      );
    }
  }
);

// ============================================================
// UPDATE HOUSEKEEPING TASK
// ============================================================

export const updateHousekeepingStatus = createAsyncThunk(
  "housekeeping/updateHousekeepingStatus",

  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const response = await houseKeepingService.updateTaskStatus(id, taskData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update housekeeping task."
      );
    }
  }
);

// ============================================================
// DELETE HOUSEKEEPING TASK
// ============================================================

export const deleteTask = createAsyncThunk(
  "housekeeping/deleteTask",

  async (id, { rejectWithValue }) => {
    try {
      const response = await houseKeepingService.deleteTask(id);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete housekeeping task."
      );
    }
  }
);

//============================================================
// assign housekeeping task
//============================================================

export const assignHousekeepingTask = createAsyncThunk(
  "housekeeping/assignHousekeepingTask",

  async ({ id, staffId, notes }, { rejectWithValue }) => {
    try {
      const response = await houseKeepingService.assignTaskToStaff(id, staffId, notes);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to assign housekeeping task."
      );
    }
  }
);



// ============================================================
// INITIAL STATE
// ============================================================

const storedUser = localStorage.getItem("hotel_user");

const initialState = {
    tasks: [],
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

const housekeepingSlice = createSlice({
  name: "housekeeping",

  initialState,

  reducers: {
    logout: (state) => {
      state.tasks = [];
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
    // get all housekeeping tasks
    // --------------------------------------------------------

    builder.addCase(getHousekeepingTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(getHousekeepingTasks.fulfilled, (state, action) => {
        console.log("getHousekeepingTasks fulfilled:", action.payload);
      state.loading = false;
        state.tasks = action.payload?.data ||
        action.payload?.data ||
    [];
    })

    .addCase(getHousekeepingTasks.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ||
        "Failed to fetch all housekeeping tasks.";
    });

      // ============================================================
// createHousekeepingTask
// ============================================================

builder
  .addCase(createTask.pending, (state) => {
    state.loading = true;
    state.error = null;
  })

  .addCase(createTask.fulfilled, (state, action) => {
    state.loading = false;
    state.error = null;
    state.tasks = [...state.tasks, action.payload];
  })

  .addCase(createTask.rejected, (state, action) => {
    state.loading = false;

    state.error =
      action.payload ||
      "Failed to create housekeeping task";
  });

    // --------------------------------------------------------
    // updateHousekeepingTask
    // --------------------------------------------------------

    builder
      .addCase(updateHousekeepingStatus.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateHousekeepingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        );
      })

      .addCase(updateHousekeepingStatus.rejected, (state) => {
        state.loading = false;
      });

    // --------------------------------------------------------
    // deleteHousekeepingTask
    // -------------------------------------------------------- 
    builder.addCase(deleteTask.pending, (state) => {
      state.loading = true;
    })

    .addCase(deleteTask.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.filter((task) => task.id !== action.payload.id);
    });

    // --------------------------------------------------------
    // assignHousekeepingTask
    // -------------------------------------------------------- 
    builder.addCase(assignHousekeepingTask.pending, (state) => {
      state.loading = true;
    })

    .addCase(assignHousekeepingTask.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks =  action.payload;
    })
    .addCase(assignHousekeepingTask.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const {
  logout,
  clearAuthError,
} = housekeepingSlice.actions;

export default housekeepingSlice.reducer;