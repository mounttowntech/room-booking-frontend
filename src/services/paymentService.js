import apiClient from "./apiClient";

const paymentService = {
  getPayments: async () => {
    const response = await apiClient.get("/payments/all");
    return response.data;
  },

  createPayment: async (data) => {
    const response = await apiClient.post("/payments/create",
      data
    );

    return response.data;
  },

  updatePayment: async (id, data) => {
    const response = await apiClient.put( `/payments/${id}`, data);

    return response.data;
  },

  deletePayment: async (id) => {
    const response = await apiClient.delete(`/payments/${id}`);

    return response.data;
  },

  //get payment summary
  getPaymentSummary: async () => {
    const response = await apiClient.get("/booking/payment-summary");
    return response.data;
  },
};

export default paymentService;