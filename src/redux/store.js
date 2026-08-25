import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import roomReducer from "./slices/roomSlice";
import guestReducer from "./slices/guestSlice";
import bookingReducer from "./slices/bookingSlice";
import paymentReducer from "./slices/paymentSlice";
import invoiceReducer from "./slices/invoiceSlice";
import housekeepingReducer from "./slices/housekeepingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    room: roomReducer,
    guest: guestReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    invoice: invoiceReducer,
    housekeeping: housekeepingReducer,
  },
});

export default store;