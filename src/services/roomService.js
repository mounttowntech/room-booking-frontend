import apiClient from "./apiClient";

const roomService = {
  // ============================================================
  // GET ROOMS
  // ============================================================

  getRooms: async () => {
    console.log("Fetching rooms from roomService...");
    const response = await apiClient.get("/rooms/all");

    return response.data;
  },

  // ============================================================
  // CREATE ROOM
  // ============================================================

  createRoom: async (data) => {
    const response = await apiClient.post("/rooms/create",  data);

    return response.data;
  },

  // ============================================================
  // UPDATE ROOM
  // ============================================================

  updateRoom: async (id, data) => {
    const response = await apiClient.put(
      `/rooms/update/${id}`,
      data
    );

    return response.data;
  },

  // ============================================================
  // DELETE ROOM
  // ============================================================

  deleteRoom: async (id) => {
    const response = await apiClient.delete(
      `/rooms/delete/${id}`
    );

    return response.data;
  }
};

export default roomService;