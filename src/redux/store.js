import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import roomReducer from "./slices/roomSlice";
import guestReducer from "./slices/guestSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    room: roomReducer,
    guest: guestReducer,
  },
});

export default store;