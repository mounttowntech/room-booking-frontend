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
      "/users/profile"
    );

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
  // LOGOUT
  // ============================================================

  logout: () => {
    localStorage.removeItem("hotel_token");
    localStorage.removeItem("hotel_user");
  },
};

export default authService;