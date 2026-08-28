import { Navigate, Outlet } from "react-router-dom";

import { useSelector } from "react-redux";

const ProtectedRoute = ({allowedRoles = []}) => {
  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );
// console.log('user_auth:',user)
  if (!isAuthenticated) {
    return ( <Navigate to="/login" replace />
    );
  }

  // No role restriction for this route
  if (allowedRoles.length === 0) {
    return <Outlet />;
  }

  const userRole = user?.role?.toLowerCase();

  // User doesn't have permission
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;