import apiClient from "./apiClient";

const housekeepingService = {
    // ============================================================
    // CREATE HOUSEKEEPING TASK
    // POST /api/housekeeping/create
    // ============================================================
    createTask: async (taskData) => {
        const response = await apiClient.post(
            "/housekeeping/create",
            taskData
        );

        return response.data;
    },

    // ============================================================
    // GET ALL HOUSEKEEPING TASKS
    // GET /api/housekeeping/all
    // ============================================================

    getTasks: async () => {
        const response = await apiClient.get(
            "/housekeeping/all"
        );

        return response.data;
    },

    // ============================================================
    // UPDATE HOUSEKEEPING TASK STATUS
    // PUT /api/housekeeping/status/:id
    // ============================================================

    updateTaskStatus: async (id, status) => {
        const response = await apiClient.put(
            `/housekeeping/status/${id}`,
            {
                status,
            }
        );

        return response.data;
    },

    // ============================================================
    // ASSIGN HOUSEKEEPING TASK TO STAFF
    // PUT /api/housekeeping/assign/:id
    // ============================================================
    assignTaskToStaff: async (id, staffId, notes) => {
        const response = await apiClient.put(
            `/housekeeping/assign/${id}`,
            {
                assignedTo: staffId,
                notes,
            }
        );

        return response.data;
    },
};

export default housekeepingService;