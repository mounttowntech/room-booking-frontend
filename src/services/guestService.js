import apiClient from "./apiClient";

const guestService = {
  // ============================================================
  // GET GUESTS
  // ============================================================

  getGuests: async () => {
    console.log("Fetching guests from guestService...");
    const response = await apiClient.get("/guest/all");

    return response.data;
  },

  // ============================================================
  // CREATE GUEST
  // ============================================================

  createGuest: async (data) => {
    const response = await apiClient.post("/guest/create",  data);

    return response.data;
  },

  // ============================================================
  // UPDATE GUEST
  // ============================================================

  updateGuest: async (id, data) => {
    const response = await apiClient.put(
      `/guest/update/${id}`,
      data
    );

    return response.data;
  },

  // ============================================================
  // DELETE GUEST
  // ============================================================

  deleteGuest: async (id) => {
    const response = await apiClient.delete(
      `/guest/delete/${id}`
    );

    return response.data;
  }
};

export default guestService;