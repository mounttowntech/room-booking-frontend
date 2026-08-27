import React, { useEffect, useState } from "react";
import { getHousekeepingStaff } from "../../redux/slices/authSlice";
import { assignHousekeepingTask } from "../../redux/slices/housekeepingSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const AssignHousekeepingForm = ({
  task,
  onSuccess,
  onClose,
}) => {
    const dispatch = useDispatch();
  const [staffId, setStaffId] = useState("");
  const [notes, setNotes] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load housekeeping staff
  useEffect(() => {
    fetchHousekeepingStaff();
  }, []);

  const fetchHousekeepingStaff = async () => {
    try {
      // Replace with your actual staff API
      const response = await dispatch(getHousekeepingStaff());

      console.log("Housekeeping staff response:", response);

      setStaffList(response?.payload?.data || []);
    } catch (error) {
      console.error("Failed to load housekeeping staff:", error);
      toast.error("Failed to load housekeeping staff");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!staffId) {
    //   alert("Please select housekeeping staff");
      toast.error("Please select housekeeping staff");
      return;
    }

    try {
      setLoading(true);

      const response = await dispatch(
        assignHousekeepingTask({
          id: task._id,
          staffId,
          notes,
        })
      );
console.log("Assign housekeeping task response:", response);

      if (!response?.payload?.success) {
        throw new Error(
          response?.payload?.message || "Failed to assign housekeeping task"
        );
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="assign-housekeeping-form"
      onSubmit={handleSubmit}
    >
      {/* Room */}
      <div className="form-group">
        <label>Room</label>

        <div className="readonly-field">
          {task?.roomId?.roomNumber || "-"}
        </div>
      </div>

      {/* Task Type */}
      <div className="form-group">
        <label>Task Type</label>

        <div className="readonly-field">
          {task?.taskType || "-"}
        </div>
      </div>

      {/* Priority */}
      <div className="form-group">
        <label>Priority</label>

        <div className="readonly-field">
          {task?.priority || "Medium"}
        </div>
      </div>

      {/* Assign To */}
      <div className="form-group">
        <label>
          Assign To <span className="required">*</span>
        </label>

        <select
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          required
        >
          <option value="">
            Select housekeeping staff
          </option>

          {staffList.map((staff) => (
            <option
              key={staff._id}
              value={staff._id}
            >
              {staff.name}
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div className="form-group">
        <label>Notes</label>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes"
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="assign-form-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? "Assigning..." : "Assign Task"}
        </button>
      </div>
    </form>
  );
};

export default AssignHousekeepingForm;