import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearAuthError } from "../../redux/slices/authSlice";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  UserPlus,
  Smartphone,
  Briefcase,
} from "lucide-react";
import "./Register.css";

// ------------------------------------------------------------
// BACKGROUND IMAGE
// Put your hotel room photo in src/assets (or wherever your
// project keeps images) and update this import path.
// Example: import bgImage from "../../assets/images/hotel-room.jpg";
// ------------------------------------------------------------
import bgImage from "../../assets/regbg.png";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formError, setFormError] = useState("");

  // ==========================================================
  // HANDLE INPUT
  // ==========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formError) setFormError("");
    if (error) {
      dispatch(clearAuthError());
    }
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreedToTerms) {
      setFormError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    // confirmPassword is only used for client-side validation above
    // and is not sent to the backend.
    const { confirmPassword, ...payload } = formData;

    const result = await dispatch(registerUser(payload));

    if (registerUser.fulfilled.match(result)) {
      navigate("/login", {
        replace: true,
        state: {
          message: "Registration successful. Please login.",
        },
      });
    }
  };

  return (
    <div
      className="register-page"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark navy shape + overlay sit on top of the background photo */}
      <div className="register-overlay" />
      <div className="register-shape" />

      <div className="register-wrapper">
        <div className="register-card">
          {/* ====================================================
              ICON
          ==================================================== */}
          <div className="register-icon">
            <UserPlus size={22} strokeWidth={2.2} />
          </div>

          {/* ====================================================
              HEADER
          ==================================================== */}
          <div className="register-header">
            <h1>Create Your Account</h1>
            <p>
              Join <span className="brand-highlight">RoomBook Suite</span> and
              simplify your operations.
            </p>
          </div>

          {/* ====================================================
              FORM
          ==================================================== */}
          <form onSubmit={handleSubmit} className="register-form">
            {/* NAME & EMAIL ROW */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <User size={17} className="input-icon" />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={17} className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            </div>

            {/* PHONE NUMBER */}
            <div className="form-group full-width">
              <label htmlFor="mobileNumber">Phone Number</label>
              <div className="input-wrapper">
                <Phone size={17} className="input-icon" />
                <input
                  id="mobileNumber"
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            {/* USERNAME & ROLE ROW */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <User size={17} className="input-icon" />
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="role">Account Role</label>
                <div className="input-wrapper">
                  <Briefcase size={17} className="input-icon" />
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="housekeeping">Housekeeping</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PASSWORD & CONFIRM PASSWORD ROW */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock size={17} className="input-icon" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex="-1"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock size={17} className="input-icon" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    tabIndex="-1"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* SECURITY INFO */}
            <div className="security-info">
              <ShieldCheck size={20} className="security-icon" />
              <span>
                Use at least 8 characters with a mix of uppercase, lowercase,
                numbers and symbols for a stronger password.
              </span>
            </div>

            {/* TERMS CHECKBOX */}
            <div className="terms-group">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <a href="#" className="link-orange">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="link-orange">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* ERROR MESSAGE */}
            {(formError || error) && (
              <div className="error-message">{formError || error}</div>
            )}

            {/* SUBMIT BUTTON */}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="loading-spinner" />
              ) : (
                <UserPlus size={18} />
              )}
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* DIVIDER */}
            <div className="divider">
              <span>OR</span>
            </div>

            {/* OTP BUTTON */}
            <button type="button" className="otp-btn">
              <Smartphone size={18} />
              Sign up with OTP
            </button>
          </form>

          {/* ====================================================
              FOOTER
          ==================================================== */}
          <div className="register-footer">
            <span>Already have an account?</span>{" "}
            <Link to="/login" className="login-link">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
