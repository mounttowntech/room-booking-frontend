import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address"),

  mobileNumber: yup
    .string()
    .required("Mobile number is required")
    .matches(
      /^[6-9]\d{9}$/,
      "Enter a valid 10-digit mobile number"
    ),

  password: yup
    .string()
    .required("Password is required")
    .min(
      6,
      "Password must be at least 6 characters"
    )
    .max(
      50,
      "Password cannot exceed 50 characters"
    ),

  role: yup
    .string()
    .required("Role is required")
    .oneOf(
      [
        "admin",
        "manager",
        "receptionist",
        "housekeeping",
      ],
      "Invalid role"
    ),
});

//login validation schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password cannot exceed 50 characters"),
});