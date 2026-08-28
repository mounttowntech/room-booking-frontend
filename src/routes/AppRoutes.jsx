import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";

import Register from "../pages/auth/Register";

import Dashboard from "../pages/dashboard/Dashboard";

import ProtectedRoute from "../components/common/ProtectedRoute";

import MainLayout from "../components/layout/MainLayout";

import RoomList from "../pages/rooms/RoomList";
import GuestList from "../pages/guests/GuestList";
import BookingList from "../pages/bookings/BookingList";
import PaymentList from "../pages/payments/PaymentList";
import Profile from "../pages/profile/Profile";
import InvoiceList from "../pages/invoices/InvoiceList";
import HousekeepingList from "../pages/housekeeping/HousekeepingList";
import Reports from "../pages/reports/Reports";
import ForgotPassword from "../pages/forgotPassword/ForgotPassword";
import ResetPassword from "../pages/resetPassword/ResetPassword";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================================
            PUBLIC ROUTES
        ===================================================== */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* =====================================================
            PROTECTED ROUTES
        ===================================================== */}

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            {/* All authenticated users */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Admin + Manager + Receptionist */}
            <Route  element={<ProtectedRoute allowedRoles={["admin","manager","receptionist"]} /> } >
              <Route path="/rooms" element={<RoomList />} />
              <Route path="/guests" element={<GuestList />} />
              <Route path="/bookings" element={<BookingList />} />
              <Route path="/payments" element={<PaymentList />} />
              <Route path="/invoices" element={<InvoiceList />} />
            </Route>

            {/* Admin + Manager + Housekeeping */}
            <Route  element={ <ProtectedRoute allowedRoles={["admin","manager","housekeeping",]} /> } >
              <Route path="/housekeeping" element={<HousekeepingList />} />
            </Route>

            {/* Admin + Manager only */}
            <Route element={<ProtectedRoute allowedRoles={["admin","manager",]} /> } >
              <Route path="/reports" element={<Reports />} />
            </Route>

            <Route path="/profile" element={<Profile />} />

          </Route>
        </Route>

        {/* =====================================================
            DEFAULT
        ===================================================== */}

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* =====================================================
            404
        ===================================================== */}

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
