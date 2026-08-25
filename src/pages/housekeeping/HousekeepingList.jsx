// src/pages/housekeeping/HousekeepingList.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";

import {
  getHousekeepingTasks,
  updateHousekeepingStatus,
} from "../../redux/slices/housekeepingSlice";

import AssignHousekeepingForm from "./AssignHousekeepingForm";

import Modal from "../../components/common/Modal";

import "./housekeeping.css";

// ============================================================
// STATUS LABELS
// ============================================================

const statusLabels = {
  pending: "Pending",
  assigned: "Assigned",
  cleaning: "Cleaning",
  completed: "Completed",
  cancelled: "Cancelled",
};

// ============================================================
// STATUS COLORS / FILTER
// ============================================================

const statusOptions = [
  "pending",
  "assigned",
  "cleaning",
  "completed",
  "cancelled",
];

// ============================================================
// COMPONENT
// ============================================================

const HousekeepingList = () => {

  const dispatch = useDispatch();

  // ==========================================================
  // REDUX
  // ==========================================================

  const {
    tasks = [],
    loading = false,
    updating = false,
    error = null,
  } = useSelector(
    (state) =>
      state.housekeeping || {
        tasks: [],
        loading: false,
        updating: false,
        error: null,
      }
  );

  // ==========================================================
  // LOCAL STATE
  // ==========================================================

  const [query, setQuery] = useState("");

  const [status, setStatus] =
    useState("all");

  const [
    selectedTask,
    setSelectedTask,
  ] = useState(null);

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [
    openActionId,
    setOpenActionId,
  ] = useState(null);


const [showAssignModal, setShowAssignModal] = useState(false);

  // ==========================================================
  // FETCH
  // ==========================================================

  const fetchTasks = async () => {
    try {
      await dispatch(
        getHousekeepingTasks()
      ).unwrap();
    } catch (error) {
      console.error(
        "Failed to fetch housekeeping:",
        error
      );

      toast.error(
        error ||
          "Failed to fetch housekeeping tasks."
      );
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ==========================================================
  // STATUS COUNTS
  // ==========================================================

  const statusCounts = useMemo(() => {

    return {
      pending: tasks.filter(
        (task) =>
          task.status === "pending"
      ).length,

      assigned: tasks.filter(
        (task) =>
          task.status === "assigned"
      ).length,

      cleaning: tasks.filter(
        (task) =>
          task.status === "cleaning"
      ).length,

      completed: tasks.filter(
        (task) =>
          task.status === "completed"
      ).length,

      cancelled: tasks.filter(
        (task) =>
          task.status === "cancelled"
      ).length,
    };

  }, [tasks]);

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredTasks = useMemo(() => {

    const search =
      query.trim().toLowerCase();

    return tasks.filter((task) => {

      const roomNumber =
        task.roomId?.roomNumber ||
        task.room?.roomNumber ||
        task.roomNumber ||
        "";

      const taskType =
        task.taskType ||
        task.type ||
        "";

      const assignedTo =
        task.assignedTo?.name ||
        task.employee?.name ||
        task.assignedUser?.name ||
        "";

      const matchesSearch =
        !search ||
        String(roomNumber)
          .toLowerCase()
          .includes(search) ||
        String(taskType)
          .toLowerCase()
          .includes(search) ||
        String(assignedTo)
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        status === "all" ||
        task.status === status;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  }, [
    tasks,
    query,
    status,
  ]);

  // ==========================================================
  // VIEW TASK
  // ==========================================================

  const handleViewTask = (task) => {

    setSelectedTask(task);

    setIsModalOpen(true);

    setOpenActionId(null);
  };

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const handleClose = () => {

    setIsModalOpen(false);

    setSelectedTask(null);
  };

  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  const handleStatusChange = async (
    task,
    newStatus
  ) => {

    try {

      const result =
        await dispatch(
          updateHousekeepingStatus({
            id: task._id,
            status: newStatus,
          })
        ).unwrap();

      toast.success(
        `Housekeeping status updated to ${statusLabels[newStatus]}.`
      );

      setOpenActionId(null);

      if (selectedTask?._id === task._id) {

        setSelectedTask(
          result?.data?.task ||
          result?.task ||
          result?.data ||
          {
            ...task,
            status: newStatus,
          }
        );
      }

    } catch (error) {

      console.error(
        "Failed to update status:",
        error
      );

      toast.error(
        error ||
          "Failed to update housekeeping status."
      );
    }
  };

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (date) => {

    if (!date) return "—";

    return new Date(date)
      .toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
  };


  const handleAssign = (task) => {
  setSelectedTask(task);
  setShowAssignModal(true);
};

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="housekeeping-page">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <header className="housekeeping-header">

        <div>

          <p className="eyebrow">
            Operations
          </p>

          <h1>
            Housekeeping
          </h1>

          <p className="subtitle">
            Manage room cleaning and housekeeping tasks
          </p>

        </div>

        <button
          type="button"
          className="primary-button"
          onClick={fetchTasks}
          disabled={loading}
        >
          ↻ Refresh
        </button>

      </header>

      {/* ====================================================
          SUMMARY
      ==================================================== */}

      <section
        className="housekeeping-summary"
        aria-label="Housekeeping summary"
      >

        {statusOptions.map(
          (statusKey) => (

            <button
              type="button"
              key={statusKey}
              className={`summary-card ${
                status === statusKey
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setStatus(
                  status === statusKey
                    ? "all"
                    : statusKey
                )
              }
            >

              <div className="summary-card-top">

                <span
                  className={`status-dot ${statusKey}`}
                />

                <span>
                  {
                    statusLabels[
                      statusKey
                    ]
                  }
                </span>

              </div>

              <strong>
                {
                  statusCounts[
                    statusKey
                  ]
                }
              </strong>

            </button>

          )
        )}

      </section>

      {/* ====================================================
          LIST PANEL
      ==================================================== */}

      <section className="housekeeping-list-panel">

        {/* TOOLBAR */}

        <div className="housekeeping-toolbar">

          <label className="search-box">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              value={query}
              onChange={(e) =>
                setQuery(
                  e.target.value
                )
              }
              placeholder="Search room, task or staff"
            />

            {query && (

              <button
                type="button"
                className="clear-search"
                onClick={() =>
                  setQuery("")
                }
              >
                ×
              </button>

            )}

          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >

            <option value="all">
              All statuses
            </option>

            {statusOptions.map(
              (statusKey) => (

                <option
                  key={statusKey}
                  value={statusKey}
                >
                  {
                    statusLabels[
                      statusKey
                    ]
                  }
                </option>

              )
            )}

          </select>

        </div>

        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="housekeeping-table-wrap">

          <table className="housekeeping-table">

            <thead>

              <tr>

                <th>Room</th>

                <th>Task</th>

                <th>Status</th>

                <th>Assigned To</th>

                <th>Created</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="table-loading"
                  >
                    <div className="loading-spinner" />
                    Loading housekeeping tasks...
                  </td>

                </tr>

              ) : filteredTasks.length > 0 ? (

                filteredTasks.map(
                  (task) => {

                    const roomNumber =
                      task.roomId
                        ?.roomNumber ||
                      task.room
                        ?.roomNumber ||
                      task.roomNumber ||
                      "—";

                    const taskType =
                      task.taskType ||
                      task.type ||
                      "Cleaning";

                    const assignedTo =
                      task.assignedTo
                        ?.name ||
                      task.employee
                        ?.name ||
                      task.assignedUser
                        ?.name ||
                      "Unassigned";

                    return (

                      <tr
                        key={task._id}
                      >

                        {/* ROOM */}

                        <td>

                          <div className="room-cell">

                            <div className="room-icon">
                              🛏
                            </div>

                            <strong>
                              Room{" "}
                              {roomNumber}
                            </strong>

                          </div>

                        </td>

                        {/* TASK */}

                        <td>

                          <span className="task-type">
                            {taskType}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`status-badge ${
                              task.status ||
                              "pending"
                            }`}
                          >

                            <span className="status-dot" />

                            {
                              statusLabels[
                                task.status
                              ] ||
                              task.status ||
                              "Pending"
                            }

                          </span>

                        </td>

                        {/* ASSIGNED */}

                        <td>

                          <span className="assigned-text">
                            {assignedTo}
                          </span>

                        </td>

                        {/* CREATED */}

                        <td>

                          <span className="date-text">
                            {formatDate(
                              task.createdAt
                            )}
                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="task-actions">

                            <button
                              type="button"
                              className="view-button"
                              onClick={() =>
                                handleViewTask(
                                  task
                                )
                              }
                            >
                              View
                            </button>

                            <button
                              type="button"
                              className="more-button"
                              onClick={() =>
                                setOpenActionId(
                                  openActionId ===
                                    task._id
                                    ? null
                                    : task._id
                                )
                              }
                            >
                              ⋮
                            </button>

                            {openActionId ===
                              task._id && (

                              <div className="action-menu">

                                {task.status !==
                                  "assigned" && (

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAssign(
                                        task
                                      )
                                    }
                                  >
                                    Assign
                                  </button>

                                )}

                                {task.status !==
                                  "cleaning" && (

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleStatusChange(
                                        task,
                                        "cleaning"
                                      )
                                    }
                                  >
                                    Start Cleaning
                                  </button>

                                )}

                                {task.status !==
                                  "completed" && (

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleStatusChange(
                                        task,
                                        "completed"
                                      )
                                    }
                                  >
                                    Mark Completed
                                  </button>

                                )}

                                {task.status !==
                                  "cancelled" && (

                                  <button
                                    type="button"
                                    className="danger-action"
                                    onClick={() =>
                                      handleStatusChange(
                                        task,
                                        "cancelled"
                                      )
                                    }
                                  >
                                    Cancel Task
                                  </button>

                                )}

                              </div>

                            )}

                          </div>

                        </td>

                      </tr>

                    );
                  }
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="empty-state-cell"
                  >

                    <div className="empty-state">

                      <div className="empty-icon">
                        🧹
                      </div>

                      <h3>
                        No housekeeping tasks
                      </h3>

                      <p>
                        No tasks match the
                        current search or filter.
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}

        {!loading &&
          tasks.length > 0 && (

            <div className="housekeeping-footer">

              Showing{" "}
              <strong>
                {filteredTasks.length}
              </strong>{" "}
              of{" "}
              <strong>
                {tasks.length}
              </strong>{" "}
              tasks

            </div>

          )}

      </section>

      {/* ====================================================
          VIEW MODAL
      ==================================================== */}

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title="Housekeeping Details"
        width="650px"
      >

        {selectedTask && (

          <div className="housekeeping-details">

            <div className="details-header">

              <div className="details-room-icon">
                🛏
              </div>

              <div>

                <h2>
                  Room{" "}
                  {
                    selectedTask.roomId
                      ?.roomNumber ||
                    selectedTask.room
                      ?.roomNumber ||
                    selectedTask.roomNumber ||
                    "—"
                  }
                </h2>

                <span
                  className={`status-badge ${
                    selectedTask.status
                  }`}
                >
                  {
                    statusLabels[
                      selectedTask.status
                    ] ||
                    selectedTask.status
                  }
                </span>

              </div>

            </div>

            <div className="details-grid">

              <div>
                <span>Task</span>

                <strong>
                  {
                    selectedTask.taskType ||
                    selectedTask.type ||
                    "Cleaning"
                  }
                </strong>
              </div>

              <div>
                <span>Assigned To</span>

                <strong>
                  {
                    selectedTask.assignedTo
                      ?.name ||
                    selectedTask.employee
                      ?.name ||
                    "Unassigned"
                  }
                </strong>
              </div>

              <div>
                <span>Created</span>

                <strong>
                  {formatDate(
                    selectedTask.createdAt
                  )}
                </strong>
              </div>

              <div>
                <span>Updated</span>

                <strong>
                  {formatDate(
                    selectedTask.updatedAt
                  )}
                </strong>
              </div>

            </div>

            {selectedTask.notes && (

              <div className="details-notes">

                <span>
                  Notes
                </span>

                <p>
                  {selectedTask.notes}
                </p>

              </div>

            )}

            <div className="details-actions">

              {selectedTask.status !==
                "cleaning" && (

                <button
                  type="button"
                  className="secondary-button"
                  disabled={updating}
                  onClick={() =>
                    handleStatusChange(
                      selectedTask,
                      "cleaning"
                    )
                  }
                >
                  Start Cleaning
                </button>

              )}

              {selectedTask.status !==
                "completed" && (

                <button
                  type="button"
                  className="primary-button"
                  disabled={updating}
                  onClick={() =>
                    handleStatusChange(
                      selectedTask,
                      "completed"
                    )
                  }
                >
                  Mark Completed
                </button>

              )}

            </div>

          </div>

        )}

      </Modal>

          <Modal
              isOpen={showAssignModal}
              onClose={() => {
                  setShowAssignModal(false);
                  setSelectedTask(null);
              }}
              title="Assign Housekeeping Task"
              width="500px"
          >
              <AssignHousekeepingForm
                  task={selectedTask}
                  onSuccess={() => {
                      setShowAssignModal(false);
                      setSelectedTask(null);
                      fetchTasks();
                  }}
                  onClose={() => {
                      setShowAssignModal(false);
                      setSelectedTask(null);
                  }}
              />
          </Modal>

    </main>
  );
};

export default HousekeepingList;