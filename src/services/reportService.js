import apiClient from "./apiClient";


// ============================================================
// BOOKING REPORT
// ============================================================
const reportService = {
    bookingReport: async (params = {}) => {
        try {
            console.log("Fetching booking report with params:", params);
            const response = await apiClient.get('/reports/bookings', { params });

            return response.data;
        } catch (error) {
            console.error("Error fetching booking report:", error);
            throw error;
        }
    },

    // ============================================================
    // REVENUE REPORT
    // ============================================================

    revenueReport: async (params = {}) => {
        try {
            const response = await apiClient.get('/reports/revenue', { params });

            return response.data;
        } catch (error) {
            console.error("Error fetching revenue report:", error);
            throw error;
        }
    }

}

export default reportService;