import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import {
  registerUser,
  clearAuthError,
} from "../../redux/slices/authSlice";

import { registerSchema } from "../../validations/authValidation";

import Input from "../../components/common/Input";

import Select from "../../components/common/Select";

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

  // ==========================================================
  // REACT HOOK FORM
  // ==========================================================

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm({
    resolver: yupResolver(
      registerSchema
    ),

    defaultValues: {
      name: "",
      email: "",
      mobileNumber: "",
      password: "",
      role: "admin",
    },
  });


  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   mobileNumber: "",
  //   password: "",
  //   role: "admin",
  // });

  // ==========================================================
  // HANDLE INPUT
  // ==========================================================

  // const handleChange = (e) => {
  //   const {
  //     name,
  //     value,
  //   } = e.target;

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));

  //   if (error) {
  //     dispatch(clearAuthError());
  //   }
  // };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  // const onSubmit = async (e) => {
  //   e.preventDefault();

  //   const result = await dispatch(
  //     registerUser(formData)
  //   );

  //   if (
  //     registerUser.fulfilled.match(result)
  //   ) {
  //     toast.success(
  //       "Registration successful. Please login."
  //     );
  //     navigate("/login", {
  //       replace: true,
  //       state: {
  //         message:
  //           "Registration successful. Please login.",
  //       },
  //     });
  //   }

  //   if (
  //     registerUser.rejected.match(result)
  //   ) {
  //     toast.error(
  //       result.payload ||
  //         "Registration failed. Please try again."
  //     );
  //   }
  // };

  const onSubmit = async (data) => {

  console.log("Validated form data:", data);

  const result = await dispatch(
    registerUser(data)
  );
console.log("Dispatch result:", result);
  if (
    registerUser.fulfilled.match(result)
  ) {
    toast.success(
      "Registration successful. Please login."
    );

    navigate("/login", {
      replace: true,
      state: {
        message:
          "Registration successful. Please login.",
      },
    });
  }

  if (
    registerUser.rejected.match(result)
  ) {
    toast.error(
      result.payload ||
        "Registration failed. Please try again."
    );
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
    <form onSubmit={handleSubmit(onSubmit)}>

      {/* Name */}
      <Input
        label="Full Name"
        type="text"
        name="name"
        // value={formData.name}
        // onChange={handleChange}
        placeholder="Enter your full name"
        register={register}
        errors={errors}
        required
      />

      {/* Email */}
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

      {/* Mobile */}
      <Input
        label="Mobile Number"
        type="tel"
        name="mobileNumber"
        // value={formData.mobileNumber}
        // onChange={handleChange}
        placeholder="Enter mobile number"
        register={register}
        errors={errors}
        required
      />

      {/* Password */}
      <Input
        label="Password"
        type="password"
        name="password"
        // value={formData.password}
        // onChange={handleChange}
        placeholder="Create a password"
        register={register}
        errors={errors}
        required
      />

      {/* Role */}
      <div className="input-group">
        {/* <label htmlFor="role">
          Account Role
        </label> */}

        {/* <select
          id="role"
          {...register("role")}
         className={
        errors.role
          ? "input-error"
          : ""
      }
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
        </select> */}

        <Select
          label="Account Role"
          name="role"
          placeholder="Select role"
          options={[
            { value: "admin", label: "Admin" },
            { value: "manager", label: "Manager" },
            { value: "receptionist", label: "Receptionist" },
            { value: "housekeeping", label: "Housekeeping" }
          ]}
          register={register}
          errors={errors}
          required
        />

        {/* {errors.role && (
      <p className="field-error">
        {errors.role.message}
      </p>
    )} */}
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