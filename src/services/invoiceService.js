import apiClient from "./apiClient";

const invoiceService = {
    // ============================================================
    // GET ALL INVOICES
    // ============================================================
    getInvoices: async () => {
        const response = await apiClient.get("/invoice/all");
        return response.data;
    },

    // ============================================================
    // GET SINGLE INVOICE
    // ============================================================

    getInvoiceById: async (id) => {
        const response = await apiClient.get(`/invoice/${id}`);
        return response.data;
    },

    // ============================================================
    // GET INVOICE BY BOOKING
    // ============================================================

    getInvoiceByBooking: async (bookingId) => {
        const response = await apiClient.get(`/invoice/booking/${bookingId}`);
        return response.data;
    },

    // ============================================================
    // CREATE INVOICE
    // ============================================================

    createInvoice: async (data) => {
        const response = await apiClient.post(
            "/invoice/create",
            data
        );

        return response.data;
    },

    // ============================================================
    // UPDATE INVOICE
    // ============================================================

    updateInvoice: async (id, data) => {
        const response = await apiClient.put(`/invoice/${id}`, data);

        return response.data;
    },

    // ============================================================
    // DELETE INVOICE
    // ============================================================

    deleteInvoice: async (id) => {
        const response = await apiClient.delete(
            `/invoice/delete/${id}`
        );

        return response.data;
    }
};

export default invoiceService;