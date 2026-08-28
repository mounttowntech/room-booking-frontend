import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    Check,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    ArrowLeft,
    KeyRound,
    Hash,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import bgImage from "../../assets/regbg.png";
import { resetPassword, verifyForgotPasswordOtp } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

const ResetPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // =========================================================
    // GET TOKEN FROM:
    // /reset-password?token=abc123
    // =========================================================

    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    // =========================================================
    // FORM STATE
    // =========================================================

    const [formData, setFormData] = useState({
        email: "",
        otp: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const loading = useSelector(
        (state) => state?.auth?.loading
    );

    // =========================================================
    // HANDLE CHANGE
    // =========================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
    };

    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccessMessage("");

        // -------------------------------------------------------
        // TOKEN VALIDATION
        // -------------------------------------------------------

        if (!token) {
            setError(
                "Invalid or expired password reset link."
            );
            return;
        }

        // -------------------------------------------------------
        // EMAIL
        // -------------------------------------------------------

        if (!formData.email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        // -------------------------------------------------------
        // OTP
        // -------------------------------------------------------

        if (!formData.otp.trim()) {
            setError("Please enter the OTP.");
            return;
        }

        // -------------------------------------------------------
        // PASSWORD
        // -------------------------------------------------------

        const password = formData.password;

        // At least 8 characters
        if (password.length < 8) {
            setError(
                "Password must be at least 8 characters."
            );
            return;
        }

        // At least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            setError(
                "Password must contain at least one uppercase letter."
            );
            return;
        }

        // At least one lowercase letter
        if (!/[a-z]/.test(password)) {
            setError(
                "Password must contain at least one lowercase letter."
            );
            return;
        }

        // At least one number
        if (!/[0-9]/.test(password)) {
            setError(
                "Password must contain at least one number."
            );
            return;
        }

        // At least one special character
        if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~+=;' ]/.test(password)) {
            setError(
                "Password must contain at least one special character."
            );
            return;
        }

        // -------------------------------------------------------
        // CONFIRM PASSWORD
        // -------------------------------------------------------

        if (password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }


        try {
            // =====================================================
            // STEP 1: VERIFY OTP
            // =====================================================

            const verifyOTPResult = await dispatch(
                verifyForgotPasswordOtp({
                    email: formData.email,
                    otp: formData.otp,
                })
            );

            console.log("verifyOTPResult:", verifyOTPResult);

            // =====================================================
            // OTP VERIFICATION SUCCESS
            // =====================================================

            if (verifyForgotPasswordOtp.fulfilled.match(verifyOTPResult)) {

                if (verifyOTPResult?.payload?.success) {

                    // =====================================================
                    // STEP 2: RESET PASSWORD
                    // =====================================================

                    const resetResult = await dispatch(
                        resetPassword({
                            email: formData.email,
                            otp: formData.otp,
                            password: formData.password,
                            token: token,
                        })
                    );

                    console.log("resetResult:", resetResult);

                    // =====================================================
                    // RESET PASSWORD SUCCESS
                    // =====================================================

                    if (resetPassword.fulfilled.match(resetResult)) {

                        toast.success(
                            resetResult.payload?.message ||
                            "Password reset successfully."
                        );

                        setFormData({
                            email: "",
                            otp: "",
                            password: "",
                            confirmPassword: "",
                        });

                        // Redirect to login
                        setTimeout(() => {
                            navigate("/login", {
                                replace: true,
                            });
                        }, 1500);

                        return;
                    }

                    // =====================================================
                    // RESET PASSWORD ERROR
                    // =====================================================

                    if (resetPassword.rejected.match(resetResult)) {

                        setError(
                            resetResult.payload ||
                            "Unable to reset password."
                        );

                        return;
                    }
                }

                // OTP API returned fulfilled but success is false
                toast.error(
                    verifyOTPResult?.payload?.message ||
                    "OTP verification failed."
                );

                return;
            }

            // =====================================================
            // OTP VERIFICATION API ERROR
            // =====================================================

            if (verifyForgotPasswordOtp.rejected.match(verifyOTPResult)) {

                toast.error(
                    verifyOTPResult?.payload?.message ||
                    verifyOTPResult?.payload ||
                    "OTP verification failed."
                );

                return;
            }

        } catch (error) {

            console.error(
                "Reset password error:",
                error
            );

            setError(
                "Something went wrong. Please try again."
            );
        }

    };

    return (
        <div
            className="login-page"
            style={{
                backgroundImage: `url(${bgImage})`,
            }}
        >
            {/* ====================================================
          BACKGROUND
      ==================================================== */}

            <div className="login-overlay" />
            <div className="login-shape" />

            <div className="login-wrapper">

                {/* ==================================================
            LEFT SIDE — HERO
        ================================================== */}

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
                        RoomBook Suite brings bookings, staff,
                        and guest experience together in one
                        simple dashboard.
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

                {/* ==================================================
            RIGHT SIDE — RESET PASSWORD CARD
        ================================================== */}

                <div className="login-card reset-password-card">

                    {/* =================================================
              ICON
          ================================================= */}

                    <div className="login-icon">
                        <KeyRound
                            size={22}
                            strokeWidth={2.2}
                        />
                    </div>

                    {/* =================================================
              HEADER
          ================================================= */}

                    <div className="login-header">

                        <h1>Reset Password</h1>

                        <p>
                            Enter the verification code and
                            create a new password for your{" "}
                            <span className="login-brand-highlight">
                                RoomBook Suite
                            </span>{" "}
                            account.
                        </p>

                    </div>

                    {/* =================================================
              SUCCESS
          ================================================= */}

                    {successMessage && (
                        <div className="login-success-message">

                            <span className="login-success-icon">
                                ✓
                            </span>

                            {successMessage}

                        </div>
                    )}

                    {/* =================================================
              ERROR
          ================================================= */}

                    {error && (
                        <div className="login-error-message">
                            {error}
                        </div>
                    )}

                    {/* =================================================
              FORM
          ================================================= */}

                    <form
                        onSubmit={handleSubmit}
                        className="login-form"
                    >

                        {/* =================================================
                EMAIL
            ================================================= */}

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
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                />

                            </div>

                        </div>

                        {/* =================================================
                OTP
            ================================================= */}

                        <div className="login-form-group full-width">

                            <label htmlFor="otp">
                                Verification Code
                            </label>

                            <div className="login-input-wrapper">

                                <Hash
                                    size={17}
                                    className="login-input-icon"
                                />

                                <input
                                    id="otp"
                                    type="text"
                                    name="otp"
                                    value={formData.otp}
                                    onChange={handleChange}
                                    placeholder="Enter OTP"
                                    inputMode="numeric"
                                    maxLength={6}
                                    required
                                />

                            </div>

                        </div>

                        {/* =================================================
                NEW PASSWORD
            ================================================= */}

                        <div className="login-form-group full-width">

                            <label htmlFor="password">
                                New Password
                            </label>

                            <div className="login-input-wrapper">

                                <Lock
                                    size={17}
                                    className="login-input-icon"
                                />

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    minLength={8}
                                    required
                                />

                                <button
                                    type="button"
                                    className="login-password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            (v) => !v
                                        )
                                    }
                                    tabIndex="-1"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={17} />
                                    ) : (
                                        <Eye size={17} />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* =================================================
                CONFIRM PASSWORD
            ================================================= */}

                        <div className="login-form-group full-width">

                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>

                            <div className="login-input-wrapper">

                                <Lock
                                    size={17}
                                    className="login-input-icon"
                                />

                                <input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    minLength={8}
                                    required
                                />

                                <button
                                    type="button"
                                    className="login-password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (v) => !v
                                        )
                                    }
                                    tabIndex="-1"
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
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

                        {/* =================================================
                PASSWORD REQUIREMENT
            ================================================= */}

                        <div className="password-requirement">
                            <span>•</span>
                            At least 8 characters with uppercase, lowercase,
                            number and special character
                        </div>

                        {/* =================================================
                SUBMIT
            ================================================= */}

                        <button
                            type="submit"
                            className="login-submit-btn"
                            disabled={loading}
                        >

                            {loading ? (
                                <span className="login-loading-spinner" />
                            ) : (
                                <KeyRound size={18} />
                            )}

                            {loading
                                ? "Updating Password..."
                                : "Reset Password"}

                        </button>

                    </form>

                    {/* ==================================================
              BACK TO LOGIN
          ================================================== */}

                    <div className="forgot-back-login">

                        <Link
                            to="/login"
                            className="back-login-link"
                        >
                            <ArrowLeft size={16} />
                            Back to Sign In
                        </Link>

                    </div>

                    {/* ==================================================
              SECURITY
          ================================================== */}

                    <div className="login-security">

                        <ShieldCheck size={14} />

                        Secure Admin Access

                    </div>

                </div>
            </div>
        </div>
    );
};

export default ResetPassword;