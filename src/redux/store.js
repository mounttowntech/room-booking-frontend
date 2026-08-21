import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import roomReducer from "./slices/roomSlice";
import guestReducer from "./slices/guestSlice";
import bookingReducer from "./slices/bookingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    room: roomReducer,
    guest: guestReducer,
    booking: bookingReducer,
  },
});

export default store;