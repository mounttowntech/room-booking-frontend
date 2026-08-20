import "./Login.css";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate, useLocation } from "react-router-dom";

import { clearAuthError, loginUser } from "../../redux/slices/authSlice";

import Input from "../../components/common/Input";

import Button from "../../components/common/Button";

const Login = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const successMessage = location.state?.message || null;

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth,
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ==========================================================
  // REDIRECT AFTER LOGIN
  // ==========================================================

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [isAuthenticated, navigate]);

  // ==========================================================
  // INPUT CHANGE
  // ==========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      dispatch(clearAuthError());
    }
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  };

  return (
    // <div className="login-page">
    //   <div className="login-card">

    //     <div className="login-header">
    //       <h1>Hotel PMS</h1>

    //       <p>
    //         Admin Portal
    //       </p>
    //     </div>

    //           {successMessage && (
    //               <div className="success-message">
    //                   {successMessage}
    //               </div>
    //           )}

    //     <form onSubmit={handleSubmit}>

    //       <Input
    //         label="Email"
    //         type="email"
    //         name="email"
    //         value={formData.email}
    //         onChange={handleChange}
    //         placeholder="Enter your email"
    //         required
    //       />

    //       <Input
    //         label="Password"
    //         type="password"
    //         name="password"
    //         value={formData.password}
    //         onChange={handleChange}
    //         placeholder="Enter your password"
    //         required
    //       />

    //       {error && (
    //         <div className="error-message">
    //           {error}
    //         </div>
    //       )}

    //       <Button
    //         type="submit"
    //         loading={loading}
    //       >
    //         Login
    //       </Button>

    //     </form>

    //           <div className="auth-footer">

    //               <span>
    //                   Don't have an account?
    //               </span>

    //               <Link to="/register">
    //                   Create Account
    //               </Link>

    //           </div>

    //   </div>
    // </div>
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-icon">🏨</div>

          <div>
            <h1>Hotel PMS</h1>
            <span>Property Management System</span>
          </div>
        </div>

        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to access your admin dashboard</p>
        </div>

        {successMessage && (
          <div className="success-message">
            <span>✓</span>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          {error && (
            <div className="error-message">
              <span>!</span>
              {error}
            </div>
          )}

          <Button type="submit" loading={loading}>
            Sign In
          </Button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account?</span>

          <Link to="/register">Create Admin Account</Link>
        </div>

        <div className="login-security">🔒 Secure Admin Access</div>
      </div>
    </div>
  );
};

export default Login;
