import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { clearAuthError, loginUser } from "../../redux/slices/authSlice";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn as LogInIcon,
  ShieldCheck,
  Check,
} from "lucide-react";
import "./Login.css";

// ------------------------------------------------------------
// BACKGROUND IMAGE
// Same photo used on the Register page — keep this import path
// pointing at the same file so both screens match.
// ------------------------------------------------------------
import bgImage from "../../assets/regbg.png";

import Input from "../../components/common/Input";

import Button from "../../components/common/Button";
import { loginSchema } from "../../validations/authValidation";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message || null;

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

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
    <div className="login-page" style={{ backgroundImage: `url(${bgImage})` }}>
      {/* Dark navy shape + overlay sit on top of the background photo */}
      <div className="login-overlay" />
      <div className="login-shape" />

      <div className="login-wrapper">
        {/* ====================================================
            LEFT SIDE — HERO TEXT
        ==================================================== */}
        <div className="login-hero">
          <h2>
            Everything your property
            <br />
            needs, <span className="login-brand-highlight">in one place</span>
          </h2>

          <p>
            RoomBook Suite brings bookings, staff, and guest experience together
            in one simple dashboard.
          </p>

          <ul className="login-hero-list">
            <li>
              <Check size={16} />
              Real-time booking management
            </li>
            <li>
              <Check size={16} />
              Role-based team access
            </li>
            <li>
              <Check size={16} />
              Secure and always available
            </li>
          </ul>
        </div>

        {/* ====================================================
            RIGHT SIDE — LOGIN CARD
        ==================================================== */}
        <div className="login-card">
          {/* ====================================================
              ICON
          ==================================================== */}
          <div className="login-icon">
            <LogInIcon size={22} strokeWidth={2.2} />
          </div>

          {/* ====================================================
              HEADER
          ==================================================== */}
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>
              Sign in to{" "}
              <span className="login-brand-highlight">RoomBook Suite</span> to
              access your admin dashboard.
            </p>
          </div>

          {/* ====================================================
              SUCCESS MESSAGE
          ==================================================== */}
          {successMessage && (
            <div className="login-success-message">
              <span className="login-success-icon">✓</span>
              {successMessage}
            </div>
          )}

          {/* ====================================================
              FORM
          ==================================================== */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* EMAIL */}
            <div className="login-form-group full-width">
              <label htmlFor="email">Email Address</label>
              <div className="login-input-wrapper">
                <Mail size={17} className="login-input-icon" />
                {/* <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                /> */}
                <Input
        label="Email Address"
        type="email"
        name="email"
        // value={formData.email}
        // onChange={handleChange}
        placeholder="Enter your email"
        register={register}
        errors={errors}
        required
      />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="login-form-group full-width">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrapper">
                <Lock size={17} className="login-input-icon" />
                {/* <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                /> */}
                <Input
        label="Password"
        type="password"
        name="password"
        // value={formData.password}
        // onChange={handleChange}
        placeholder="Enter your password"
        register={register}
        errors={errors}
        required
      />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex="-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && <div className="login-error-message">{error}</div>}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="login-loading-spinner" />
              ) : (
                <LogInIcon size={18} />
              )}
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* ====================================================
              FOOTER
          ==================================================== */}
          <div className="login-footer">
            <span>Don&apos;t have an account?</span>{" "}
            <Link to="/register" className="register-link">
              Create Admin Account
            </Link>
          </div>

          {/* ====================================================
              SECURITY NOTE
          ==================================================== */}
          <div className="login-security">
            <ShieldCheck size={14} />
            Secure Admin Access
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;