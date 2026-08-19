import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  registerUser,
  clearAuthError,
} from "../../redux/slices/authSlice";

import Input from "../../components/common/Input";

import Button from "../../components/common/Button";

const Register = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    loading,
    error,
  } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
    role: "admin",
  });

  // ==========================================================
  // HANDLE INPUT
  // ==========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

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

    const result = await dispatch(
      registerUser(formData)
    );

    if (
      registerUser.fulfilled.match(result)
    ) {
      navigate("/login", {
        replace: true,
        state: {
          message:
            "Registration successful. Please login.",
        },
      });
    }
  };

  return (
    // <div className="login-page">

    //   <div className="login-card register-card">

    //     {/* ====================================================
    //         HEADER
    //     ==================================================== */}

    //     <div className="login-header">

    //       <h1>Hotel PMS</h1>

    //       <p>
    //         Create Admin Account
    //       </p>

    //     </div>

    //     {/* ====================================================
    //         FORM
    //     ==================================================== */}

    //     <form onSubmit={handleSubmit}>

    //       {/* NAME */}

    //       <Input
    //         label="Name"
    //         type="text"
    //         name="name"
    //         value={formData.name}
    //         onChange={handleChange}
    //         placeholder="Enter your name"
    //         required
    //       />

    //       {/* EMAIL */}

    //       <Input
    //         label="Email"
    //         type="email"
    //         name="email"
    //         value={formData.email}
    //         onChange={handleChange}
    //         placeholder="Enter your email"
    //         required
    //       />

    //       {/* MOBILE */}

    //       <Input
    //         label="Mobile Number"
    //         type="tel"
    //         name="mobileNumber"
    //         value={formData.mobileNumber}
    //         onChange={handleChange}
    //         placeholder="Enter mobile number"
    //         required
    //       />

    //       {/* PASSWORD */}

    //       <Input
    //         label="Password"
    //         type="password"
    //         name="password"
    //         value={formData.password}
    //         onChange={handleChange}
    //         placeholder="Enter password"
    //         required
    //       />

    //       {/* ROLE */}

    //       <div className="input-group">

    //         <label htmlFor="role">
    //           Role
    //         </label>

    //         <select
    //           id="role"
    //           name="role"
    //           value={formData.role}
    //           onChange={handleChange}
    //           required
    //         >

    //           <option value="admin">
    //             Admin
    //           </option>

    //           <option value="manager">
    //             Manager
    //           </option>

    //           <option value="receptionist">
    //             Receptionist
    //           </option>

    //           <option value="housekeeping">
    //             Housekeeping
    //           </option>

    //         </select>

    //       </div>

    //       {/* ERROR */}

    //       {error && (
    //         <div className="error-message">
    //           {error}
    //         </div>
    //       )}

    //       {/* SUBMIT */}

    //       <Button
    //         type="submit"
    //         loading={loading}
    //       >
    //         Create Account
    //       </Button>

    //     </form>

    //     {/* ====================================================
    //         LOGIN LINK
    //     ==================================================== */}

    //     <div className="auth-footer">

    //       <span>
    //         Already have an account?
    //       </span>

    //       <Link to="/login">
    //         Login
    //       </Link>

    //     </div>

    //   </div>

    // </div>
    <div className="login-page">

  <div className="login-card register-card">

    {/* Brand */}
    <div className="login-brand">
      <div className="brand-icon">
        🏨
      </div>

      <div>
        <h1>Hotel PMS</h1>
        <span>Property Management System</span>
      </div>
    </div>

    {/* Header */}
    <div className="login-header">
      <h2>Create Admin Account</h2>
      <p>Set up your account to manage the hotel</p>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit}>

      {/* Name */}
      <Input
        label="Full Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your full name"
        required
      />

      {/* Email */}
      <Input
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
      />

      {/* Mobile */}
      <Input
        label="Mobile Number"
        type="tel"
        name="mobileNumber"
        value={formData.mobileNumber}
        onChange={handleChange}
        placeholder="Enter mobile number"
        required
      />

      {/* Password */}
      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Create a password"
        required
      />

      {/* Role */}
      <div className="input-group">
        <label htmlFor="role">
          Account Role
        </label>

        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="admin">
            Admin
          </option>

          <option value="manager">
            Manager
          </option>

          <option value="receptionist">
            Receptionist
          </option>

          <option value="housekeeping">
            Housekeeping
          </option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="error-message">
          <span>!</span>
          {error}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        loading={loading}
      >
        Create Account
      </Button>

    </form>

    {/* Login */}
    <div className="auth-footer">
      <span>Already have an account?</span>

      <Link to="/login">
        Sign In
      </Link>
    </div>

    {/* Security */}
    <div className="login-security">
      🔒 Your account information is securely protected
    </div>

  </div>

</div>
  );
};

export default Register;