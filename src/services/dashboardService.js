import apiClient from "./apiClient";

const dashboardService = {
  getDashboardData: async () => {
    const response = await apiClient.get("/dashboard/all");
    return response.data;
  }
};

export default dashboardService;