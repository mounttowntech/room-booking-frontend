import apiClient from "./apiClient";

const authService = {
  // ============================================================
  // LOGIN
  // ============================================================

  login: async (data) => {
    const response = await apiClient.post(
      "/users/login",
      data
    );

    return response.data;
  },

  // ============================================================
  // REGISTER
  // ============================================================

  register: async (data) => {
    const response = await apiClient.post(
      "/users/register",
      data
    );

    return response.data;
  },

  // ============================================================
  // GET PROFILE
  // ============================================================

  getProfile: async () => {
    const response = await apiClient.get(
      "/users/me"
    );

    return response.data;
  },

  // ============================================================
  // CHANGE PASSWORD
  // ============================================================

  changePassword: async (data) => {
    const response = await apiClient.post("/users/change-password", data);

    return response.data;
  },

  // ============================================================
  // get housekeeping staff
  // ============================================================

  getHousekeepingStaff: async () => {
    const response = await apiClient.get(
      "/users/housekeeping-staff"
    );

    return response.data;
  },

  // ============================================================
  //forgot password
  // ============================================================
  forgotPassword: async (data) => {
    const response = await apiClient.post("/users/forgot-password", data);

    return response.data;
  },

  // ============================================================
  //Verify otp
  // ============================================================
  verifyforgotPasswordOtp: async (data) => {
    const response = await apiClient.post("/users/verify-forgot-password-otp", data);

    return response.data;
  },

  // ============================================================
  //reset password
  // ============================================================
  resetPassword: async (data) => {
    const response = await apiClient.post("/users/reset-password", data);

    return response.data;
  },

  // ============================================================
  // LOGOUT
  // ============================================================

  logout: () => {
    localStorage.removeItem("hotel_token");
    localStorage.removeItem("hotel_user");
  },
};

export default authService;