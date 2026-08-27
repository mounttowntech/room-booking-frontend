import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import roomReducer from "./slices/roomSlice";
import guestReducer from "./slices/guestSlice";
import bookingReducer from "./slices/bookingSlice";
import paymentReducer from "./slices/paymentSlice";
import invoiceReducer from "./slices/invoiceSlice";
import housekeepingReducer from "./slices/housekeepingSlice";
import dashboardReducer from "./slices/dashboardSlice";
import reportReducer from "./slices/reportSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    room: roomReducer,
    guest: guestReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    invoice: invoiceReducer,
    housekeeping: housekeepingReducer,
    dashboard: dashboardReducer,
    reports: reportReducer,
  },
});

export default store;