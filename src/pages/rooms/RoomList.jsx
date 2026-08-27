import React, { useEffect, useMemo, useState } from "react";
import RoomForm from "./RoomForm";
import Modal from "../../components/common/Modal";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../../redux/slices/roomSlice";
import "./rooms.css";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const statusLabels = {
  available: "Available",
  reserved: "Reserved",
  occupied: "Occupied",
  cleaning: "Cleaning",
  maintenance: "Maintenance",
};

const roomTypeLabels = {
  single: "Single",
  double: "Double",
  twin: "Twin",
  deluxe: "Deluxe",
  suite: "Suite",
  family: "Family",
};

const RoomList = () => {
    const dispatch = useDispatch();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const [openActionId, setOpenActionId] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [room, setRoom] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

  // ============================================================
  // FETCH ROOMS
  // ============================================================

  const fetchRooms = async () => {
    try {
      setLoading(true);
console.log("Fetching rooms...");
      const response = await dispatch(getRooms()).unwrap();

      console.log("Fetched rooms:", response);

      const roomData =
        response?.data?.rooms ||
        response?.data?.data ||
        response?.data ||
        [];

      setRooms(Array.isArray(roomData) ? roomData : []);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);

      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // ============================================================
  // SUMMARY COUNTS
  // ============================================================

  const statusCounts = useMemo(() => {
    return {
      available: rooms.filter(
        (room) => room.status === "available"
      ).length,

      reserved: rooms.filter(
        (room) => room.status === "reserved"
      ).length,

      occupied: rooms.filter(
        (room) => room.status === "occupied"
      ).length,

      cleaning: rooms.filter(
        (room) => room.status === "cleaning"
      ).length,

      maintenance: rooms.filter(
        (room) => room.status === "maintenance"
      ).length,
    };
  }, [rooms]);

  // ============================================================
  // FILTER ROOMS
  // ============================================================

  const filteredRooms = useMemo(() => {
    const searchValue = query.trim().toLowerCase();

    return rooms.filter((room) => {
      const matchesSearch =
        !searchValue ||
        room.roomNumber
          ?.toLowerCase()
          .includes(searchValue) ||
        room.roomType
          ?.toLowerCase()
          .includes(searchValue) ||
        room.floor
          ?.toLowerCase()
          .includes(searchValue) ||
        room.description
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        status === "all" || room.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [rooms, query, status]);

  // ============================================================
// PAGINATION
// ============================================================

const totalItems = filteredRooms.length;

const totalPages = Math.ceil(
  totalItems / itemsPerPage
);

const startIndex =
  (currentPage - 1) * itemsPerPage;

const endIndex =
  startIndex + itemsPerPage;

const paginatedRooms =
  filteredRooms.slice(
    startIndex,
    endIndex
  );


  useEffect(() => {
  setCurrentPage(1);
}, [query, status, itemsPerPage]);

  // ============================================================
  // ADD ROOM
  // ============================================================

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
    setOpenActionId(null);
  };

  // ============================================================
  // EDIT ROOM
  // ============================================================

  const handleEditRoom = (room) => {
    console.log("Editing room:", room);
    setSelectedRoom(room);
    setIsModalOpen(true);
    setOpenActionId(null);
  };

  // ============================================================
  // CLOSE FORM
  // ============================================================

  const handleCloseForm = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  // ============================================================
  // FORM SUCCESS
  // ============================================================

  const handleFormSuccess = () => {
    handleCloseForm();
    fetchRooms();
  };

  // ============================================================
  // DELETE ROOM
  // ============================================================

  const handleDeleteRoom = async (room) => {
    setOpenActionId(null);

    const confirmed = window.confirm(
      `Are you sure you want to delete Room ${room.roomNumber}?`
    );

    if (!confirmed) return;

    try {
      const result = await dispatch(deleteRoom(room._id));

      if (deleteRoom.fulfilled.match(result)) {
        toast.success("Room deleted successfully!");
        fetchRooms();
      }
    } catch (error) {
      console.error("Failed to delete room:", error);

      toast.error(error?.response?.data?.message || "Failed to delete room");
    }
  };

  // ============================================================
  // FORMAT CURRENCY
  // ============================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  }

    const handleFormSubmit = async (formData) => {
        try {
            if (selectedRoom) {
                const result = await dispatch(updateRoom({ id: selectedRoom._id, roomData: formData }));
                console.log("Room updated:", result);
                if (updateRoom.fulfilled.match(result)) {
                    toast.success("Room updated successfully!");
                    handleFormSuccess();
                }
            } else {
                const result = await dispatch(createRoom(formData));
                console.log("Room created:", result);
                if (createRoom.fulfilled.match(result)) {
                    toast.success("Room created successfully!");
                    handleFormSuccess();
                }
            }
        } catch (error) {
            console.error("Failed to submit room form:", error);
            toast.error(error?.response?.data?.message || "Failed to submit room form");
            // alert(
            //     error?.response?.data?.message ||
            //     "Failed to submit room form"
            // );
        }
    };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="room-list-page">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <header className="room-list-header">

        <div>
          <p className="eyebrow">Front desk</p>

          <h1>Rooms</h1>

          <p className="subtitle">
            Manage room availability and occupancy
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleAddRoom}
        >
          <span className="button-icon">+</span>
          Add room
        </button>

      </header>


      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <section
        className="room-summary"
        aria-label="Room summary"
      >

        {Object.entries(statusLabels).map(
          ([key, label]) => (
            <button
              type="button"
              key={key}
              className={`summary-card ${
                status === key ? "selected" : ""
              }`}
              onClick={() =>
                setStatus(
                  status === key ? "all" : key
                )
              }
            >

              <div className="summary-card-top">

                <span
                  className={`status-dot ${key}`}
                />

                <span className="summary-label">
                  {label}
                </span>

              </div>

              <strong>
                {statusCounts[key]}
              </strong>

            </button>
          )
        )}

      </section>


      {/* ======================================================
          ROOM LIST PANEL
      ====================================================== */}

      <section className="room-list-panel">

        {/* TOOLBAR */}

        <div className="room-list-toolbar">

          <div className="toolbar-left">

            <label className="search-box">

              <span
                className="search-icon"
                aria-hidden="true"
              >
                ⌕
              </span>

              <input
                type="text"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search by room number, type or floor"
                aria-label="Search rooms"
              />

              {query && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setQuery("")}
                >
                  ×
                </button>
              )}

            </label>

          </div>


          <div className="toolbar-right">

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              aria-label="Filter by status"
            >

              <option value="all">
                All statuses
              </option>

              {Object.entries(statusLabels).map(
                ([key, label]) => (
                  <option
                    value={key}
                    key={key}
                  >
                    {label}
                  </option>
                )
              )}

            </select>

            <button
              type="button"
              className="refresh-button"
              onClick={fetchRooms}
              disabled={loading}
              title="Refresh"
            >
              ↻
            </button>

          </div>

        </div>


        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="room-table-wrap">

          <table className="room-table">

            <thead>

              <tr>

                <th>Room</th>

                <th>Room type</th>

                <th>Floor</th>

                <th>Status</th>

                <th>Capacity</th>

                <th>Rate</th>

                <th className="actions-column">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="7"
                    className="table-loading"
                  >
                    <div className="loading-spinner" />
                    Loading rooms...
                  </td>

                </tr>

              ) : paginatedRooms.length > 0 ? (

                paginatedRooms.map((room) => (

                  <tr key={room._id}>

                    {/* ROOM */}

                    <td>

                      <div className="room-number-cell">

                        <div className="room-icon">
                          🛏
                        </div>

                        <div>

                          <strong>
                            Room {room.roomNumber}
                          </strong>

                          {room.description && (
                            <span>
                              {room.description}
                            </span>
                          )}

                        </div>

                      </div>

                    </td>


                    {/* ROOM TYPE */}

                    <td>

                      <span className="room-type">
                        {roomTypeLabels[
                          room.roomType
                        ] ||
                          room.roomType ||
                          "—"}
                      </span>

                    </td>


                    {/* FLOOR */}

                    <td>

                      <span className="floor-text">
                        {room.floor
                          ? `Floor ${room.floor}`
                          : "—"}
                      </span>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`status-badge ${
                          room.status || "available"
                        }`}
                      >

                        <span className="status-dot" />

                        {statusLabels[
                          room.status
                        ] ||
                          room.status ||
                          "Unknown"}

                      </span>

                    </td>


                    {/* CAPACITY */}

                    <td>

                      <div className="capacity-cell">

                        <span>
                          {room.maxAdults || 0} Adults
                        </span>

                        <span>
                          {room.maxChildren || 0} Children
                        </span>

                      </div>

                    </td>


                    {/* RATE */}

                    <td>

                      <div className="rate-cell">

                        <strong>
                          {formatCurrency(
                            room.pricePerNight
                          )}
                        </strong>

                        <small>
                          / night
                        </small>

                      </div>

                    </td>


                    {/* ACTIONS */}

                    <td className="actions-column">

                      <div className="room-actions">

                        <button
                          type="button"
                          className="more-button"
                          aria-label={`Actions for room ${room.roomNumber}`}
                          onClick={() =>
                            setOpenActionId(
                              openActionId === room._id
                                ? null
                                : room._id
                            )
                          }
                        >
                          ⋮
                        </button>


                        {openActionId === room._id && (

                          <div className="action-menu">

                            <button
                              type="button"
                              onClick={() =>
                                handleEditRoom(room)
                              }
                            >
                              <span>✎</span>
                              Edit room
                            </button>

                            <button
                              type="button"
                              className="danger-action"
                              onClick={() =>
                                handleDeleteRoom(room)
                              }
                            >
                              <span>⌫</span>
                              Delete room
                            </button>

                          </div>

                        )}

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="empty-state-cell"
                  >

                    <div className="empty-state">

                      <div className="empty-icon">
                        🛏
                      </div>

                      <h3>
                        No rooms found
                      </h3>

                      <p>
                        {query || status !== "all"
                          ? "Try changing your search or filter."
                          : "Start by adding your first room."}
                      </p>

                      {!query &&
                        status === "all" && (
                          <button
                            type="button"
                            className="primary-button"
                            onClick={handleAddRoom}
                          >
                            <span>+</span>
                            Add room
                          </button>
                        )}

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* TABLE FOOTER */}

        {/* {!loading && rooms.length > 0 && (

          <div className="room-list-footer">

            <span>
              Showing{" "}
              <strong>
                {filteredRooms.length}
              </strong>{" "}
              of{" "}
              <strong>
                {rooms.length}
              </strong>{" "}
              rooms
            </span>

          </div>

        )} */}

        {/* ======================================================
    TABLE FOOTER / PAGINATION
====================================================== */}

{!loading && filteredRooms.length > 0 && (

  <div className="room-list-footer">

    {/* SHOWING INFO */}

    <div className="pagination-info">

      Showing{" "}

      <strong>
        {startIndex + 1}
      </strong>

      {" - "}

      <strong>
        {Math.min(
          endIndex,
          totalItems
        )}
      </strong>

      {" of "}

      <strong>
        {totalItems}
      </strong>

      {" rooms"}

    </div>


    {/* ITEMS PER PAGE */}

    <div className="pagination-size">

      <span>
        Rows:
      </span>

      <select
        value={itemsPerPage}
        onChange={(event) => {
          setItemsPerPage(
            Number(event.target.value)
          );

          setCurrentPage(1);
        }}
      >

        <option value={5}>
          5
        </option>

        <option value={10}>
          10
        </option>

        <option value={20}>
          20
        </option>

        <option value={50}>
          50
        </option>

      </select>

    </div>


    {/* PAGINATION */}

    {totalPages > 1 && (

      <div className="pagination-controls">

        {/* PREVIOUS */}

        <button
          type="button"
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(
              (page) => page - 1
            )
          }
          aria-label="Previous page"
        >
          ‹
        </button>


        {/* PAGE NUMBERS */}

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((page) => (

          <button
            type="button"
            key={page}
            className={
              currentPage === page
                ? "pagination-button active"
                : "pagination-button"
            }
            onClick={() =>
              setCurrentPage(page)
            }
          >
            {page}
          </button>

        ))}


        {/* NEXT */}

        <button
          type="button"
          className="pagination-button"
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            setCurrentPage(
              (page) => page + 1
            )
          }
          aria-label="Next page"
        >
          ›
        </button>

      </div>

    )}

  </div>

)}

      </section>


      {/* ======================================================
          ADD / EDIT ROOM MODAL
      ====================================================== */}

      {/* <Modal
        isOpen={showFormModal}
        onClose={handleCloseForm}
        title={
          selectedRoom
            ? "Edit room"
            : "Add new room"
        }
      >

        <RoomForm
          room={selectedRoom}
          onSuccess={handleFormSuccess}
          onCancel={handleCloseForm}
        />

      </Modal> */}
<Modal
  isOpen={isModalOpen}
  onClose={handleClose}
  title={room ? "Edit Room" : "Add New Room"}
  width="800px"
>
  <RoomForm
    room={selectedRoom}
    onSubmit={handleFormSubmit}
    onClose={handleClose}
  />
</Modal>
    </main>
  );
};

export default RoomList;