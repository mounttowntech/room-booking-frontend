import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "../pages/auth/Login";

import Register from "../pages/auth/Register";

import Dashboard from "../pages/dashboard/Dashboard";

import ProtectedRoute from "../components/common/ProtectedRoute";

import MainLayout from "../components/layout/MainLayout";

import RoomList from "../pages/rooms/RoomList"

const AppRoutes = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
        ===================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

              <Route
                  path="/register"
                  element={<Register />}
              />

        {/* =====================================================
            PROTECTED ROUTES
        ===================================================== */}

        <Route element={<ProtectedRoute />}>

          <Route
            element={<MainLayout />}
          >

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rooms" element={<RoomList />} />

          </Route>

        </Route>

        {/* =====================================================
            DEFAULT
        ===================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* =====================================================
            404
        ===================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;