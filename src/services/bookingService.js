import apiClient from "./apiClient";

const bookingService = {
  getBookings: async () => {
    const response = await apiClient.get("/booking/all");
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await apiClient.get(`/booking/${id}`);
    return response.data;
  },

  createBooking: async (data) => {
    const response = await apiClient.post(
      "/booking/create",
      data
    );

    return response.data;
  },

  updateBooking: async (id, data) => {
    const response = await apiClient.put(
      `/booking/${id}`,
      data
    );

    return response.data;
  },

  deleteBooking: async (id) => {
    const response = await apiClient.delete(
      `/booking/${id}`
    );

    return response.data;
  },
  cancelBooking: async ({id, reason}) => {
    const response = await apiClient.put(
      `/booking/cancel/${id}`,
      { reason }
    );
    return response.data;
  }
};

export default bookingService;