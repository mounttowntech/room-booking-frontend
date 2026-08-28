import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Mail,
  KeyRound,
  ShieldCheck,
  ArrowLeft,
  Send,
} from "lucide-react";

import bgImage from "../../assets/regbg.png";
import { forgotPassword } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
// Change the above path according to your project

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccessMessage("");
  setLoading(true);

  try {
    const forgotPasswordData = {
      email: email.trim(),
    };

    const result = await dispatch(
      forgotPassword(forgotPasswordData)
    );
console.log('forgot_res',result)
    if (forgotPassword.fulfilled.match(result)) {
      toast.success(result?.payload
?.message || "Reset link sent successfully!");

      setSuccessMessage(result?.payload
?.message ||  "If an account exists with this email, a password reset link has been sent."
      );

      setEmail("");
    } else if (forgotPassword.rejected.match(result)) {
      toast.error(
        result.payload ||
          "Unable to send reset link. Please try again."
      );

      setError(
        result.payload ||
          "Unable to send reset link. Please try again."
      );
    }
  } catch (error) {
    console.error("Forgot password error:", error);

    setError(
      error?.message ||
        "Unable to send reset link. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark navy shape + overlay */}
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
            needs,{" "}
            <span className="login-brand-highlight">
              in one place
            </span>
          </h2>

          <p>
            RoomBook Suite brings bookings, staff, and guest
            experience together in one simple dashboard.
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
            RIGHT SIDE — FORGOT PASSWORD CARD
        ==================================================== */}

        <div className="login-card forgot-password-card">

          {/* ====================================================
              ICON
          ==================================================== */}

          <div className="login-icon">
            <KeyRound
              size={22}
              strokeWidth={2.2}
            />
          </div>

          {/* ====================================================
              HEADER
          ==================================================== */}

          <div className="login-header">
            <h1>Forgot Password?</h1>

            <p>
              Enter your email address and we'll send you a
              <span className="login-brand-highlight">
                {" "}password reset link.
              </span>
            </p>
          </div>

          {/* ====================================================
              SUCCESS MESSAGE
          ==================================================== */}

          {successMessage && (
            <div className="login-success-message">
              <span className="login-success-icon">
                ✓
              </span>

              {successMessage}
            </div>
          )}

          {/* ====================================================
              ERROR MESSAGE
          ==================================================== */}

          {error && (
            <div className="login-error-message">
              {error}
            </div>
          )}

          {/* ====================================================
              FORM
          ==================================================== */}

          <form
            onSubmit={handleSubmit}
            className="login-form"
          >

            {/* EMAIL */}

            <div className="login-form-group full-width">
              <label htmlFor="email">
                Email Address
              </label>

              <div className="login-input-wrapper">
                <Mail
                  size={17}
                  className="login-input-icon"
                />

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="login-loading-spinner" />
              ) : (
                <Send size={18} />
              )}

              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>
          </form>

          {/* ====================================================
              BACK TO LOGIN
          ==================================================== */}

          <div className="forgot-back-login">
            <Link
              to="/login"
              className="back-login-link"
            >
              <ArrowLeft size={16} />
              Back to Sign In
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

export default ForgotPassword;