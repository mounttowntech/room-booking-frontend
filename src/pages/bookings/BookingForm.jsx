import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBooking, updateBooking } from "../../redux/slices/bookingSlice";
import { getRooms } from "../../redux/slices/roomSlice";
import { getGuests } from "../../redux/slices/guestSlice";
import toast from "react-hot-toast";
import "./booking.css";

const BookingForm = ({
  booking = null,
  onSuccess,
  onClose,
}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    guestId: "",
    roomId: "",

    checkInDate: "",
    checkOutDate: "",

    adults: 1,
    children: 0,

    nights: 1,

    roomRate: 0,
    roomAmount: 0,

    discount: 0,
    taxAmount: 0,

    totalAmount: 0,

    paidAmount: 0,
    dueAmount: 0,

    bookingStatus: "pending",
    paymentStatus: "unpaid",

    source: "walk_in",

    specialRequest: "",
    notes: "",
  });

  // ============================================================
  // REDUX DATA
  // ============================================================

  const rooms = useSelector(
    (state) => state?.room?.rooms || []
  );

  console.log("Rooms from Redux:", rooms);

  const guests = useSelector(
    (state) => state?.guest?.guests || []
  );

  console.log("Guests from Redux:", guests);

  // ============================================================
  // FETCH GUESTS / ROOMS
  // ============================================================

  useEffect(() => {
    dispatch(getRooms());
    dispatch(getGuests());
  }, [dispatch]);

  // ============================================================
  // EDIT BOOKING
  // ============================================================

  useEffect(() => {
    if (!booking) return;

    setFormData({
      guestId: booking.guestId?._id || booking.guestId || "",
      roomId: booking.roomId?._id || booking.roomId || "",

      checkInDate: formatDateForInput(booking.checkInDate),
      checkOutDate: formatDateForInput(booking.checkOutDate),

      adults: booking.adults ?? 1,
      children: booking.children ?? 0,

      nights: booking.nights ?? 1,

      roomRate: booking.roomRate ?? 0,
      roomAmount: booking.roomAmount ?? 0,

      discount: booking.discount ?? 0,
      taxAmount: booking.taxAmount ?? 0,

      totalAmount: booking.totalAmount ?? 0,

      paidAmount: booking.paidAmount ?? 0,
      dueAmount: booking.dueAmount ?? 0,

      bookingStatus: booking.bookingStatus || "pending",
      paymentStatus: booking.paymentStatus || "unpaid",

      source: booking.source || "walk_in",

      specialRequest: booking.specialRequest || "",
      notes: booking.notes || "",
    });
  }, [booking]);

  // ============================================================
  // DATE FORMATTER
  // ============================================================

  const formatDateForInput = (date) => {
    if (!date) return "";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "";
    }

    return d.toISOString().split("T")[0];
  };

  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // SELECTED ROOM
  // ============================================================

  const selectedRoom = useMemo(() => {
    return rooms?.data?.find(
      (room) => room._id === formData.roomId
    );
  }, [rooms, formData.roomId]);

  // ============================================================
  // SELECTED GUEST
  // ============================================================

  const selectedGuest = useMemo(() => {
    return guests?.data?.find(
      (guest) => guest._id === formData.guestId
    );
  }, [guests, formData.guestId]);

  // ============================================================
  // ROOM CHANGE
  // ============================================================

  const handleRoomChange = (e) => {
    const roomId = e.target.value;

    const room = rooms?.data?.find(
      (item) => item._id === roomId
    );

    setFormData((prev) => ({
      ...prev,
      roomId,
      roomRate: room?.pricePerNight || 0,
    }));
  };

  // ============================================================
  // CALCULATE NIGHTS
  // ============================================================

  useEffect(() => {
    if (
      !formData.checkInDate ||
      !formData.checkOutDate
    ) {
      return;
    }

    const checkIn = new Date(
      `${formData.checkInDate}T00:00:00`
    );

    const checkOut = new Date(
      `${formData.checkOutDate}T00:00:00`
    );

    const difference =
      checkOut.getTime() -
      checkIn.getTime();

    const calculatedNights = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    setFormData((prev) => ({
      ...prev,
      nights:
        calculatedNights > 0
          ? calculatedNights
          : 0,
    }));
  }, [
    formData.checkInDate,
    formData.checkOutDate,
  ]);

  // ============================================================
  // CALCULATE AMOUNTS
  // ============================================================

  useEffect(() => {
    const roomRate =
      Number(formData.roomRate) || 0;

    const nights =
      Number(formData.nights) || 0;

    const discount =
      Number(formData.discount) || 0;

    const taxAmount =
      Number(formData.taxAmount) || 0;

    const paidAmount =
      Number(formData.paidAmount) || 0;

    const roomAmount =
      roomRate * nights;

    const totalAmount =
      roomAmount -
      discount +
      taxAmount;

    const dueAmount =
      Math.max(
        totalAmount - paidAmount,
        0
      );

    setFormData((prev) => ({
      ...prev,
      roomAmount,
      totalAmount,
      dueAmount,
    }));
  }, [
    formData.roomRate,
    formData.nights,
    formData.discount,
    formData.taxAmount,
    formData.paidAmount,
  ]);

  // ============================================================
  // PAYMENT STATUS
  // ============================================================

  useEffect(() => {
    const total =
      Number(formData.totalAmount) || 0;

    const paid =
      Number(formData.paidAmount) || 0;

    let paymentStatus = "unpaid";

    if (paid >= total && total > 0) {
      paymentStatus = "paid";
    } else if (paid > 0 && paid < total) {
      paymentStatus = "partial";
    }

    setFormData((prev) => ({
      ...prev,
      paymentStatus,
    }));
  }, [
    formData.totalAmount,
    formData.paidAmount,
  ]);

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateForm = () => {
    if (!formData.guestId) {
      toast.error("Please select a guest");
      return false;
    }

    if (!formData.roomId) {
      toast.error("Please select a room");
      return false;
    }

    if (!formData.checkInDate) {
      toast.error("Please select check-in date");
      return false;
    }

    if (!formData.checkOutDate) {
      toast.error("Please select check-out date");
      return false;
    }

    if (formData.nights <= 0) {
      toast.error(
        "Check-out date must be after check-in date"
      );
      return false;
    }

    if (Number(formData.adults) < 1) {
      toast.error(
        "At least one adult is required"
      );
      return false;
    }

    if (
      selectedRoom &&
      selectedRoom.capacity &&
      Number(formData.adults) +
        Number(formData.children) >
        selectedRoom.capacity
    ) {
      toast.error(
        `Room capacity is ${selectedRoom.capacity} guests`
      );
      return false;
    }

    if (
      Number(formData.paidAmount) >
      Number(formData.totalAmount)
    ) {
      toast.error(
        "Paid amount cannot be greater than total amount"
      );
      return false;
    }

    return true;
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        guestId: formData.guestId,
        roomId: formData.roomId,

        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,

        adults: Number(formData.adults),
        children: Number(formData.children),

        nights: Number(formData.nights),

        roomRate: Number(formData.roomRate),
        roomAmount: Number(formData.roomAmount),

        discount: Number(formData.discount),
        taxAmount: Number(formData.taxAmount),

        totalAmount: Number(formData.totalAmount),

        paidAmount: Number(formData.paidAmount),
        dueAmount: Number(formData.dueAmount),

        bookingStatus: formData.bookingStatus,
        paymentStatus: formData.paymentStatus,

        source: formData.source,

        specialRequest:
          formData.specialRequest,

        notes: formData.notes,
      };

      let result;

      if (booking?._id) {
        result = await dispatch(
          updateBooking({
            id: booking._id,
            bookingData: payload,
          })
        );
      } else {
        result = await dispatch(
          createBooking(payload)
        );
      }

      if (
        createBooking.fulfilled.match(result) ||
        updateBooking.fulfilled.match(result)
      ) {
        toast.success(
          booking
            ? "Booking updated successfully!"
            : "Booking created successfully!"
        );

        if (onSuccess) {
          onSuccess(result.payload);
        }
      } else {
        toast.error(
          result.payload ||
            "Failed to save booking"
        );
      }
    } catch (error) {
      console.error(
        "Booking submit error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save booking"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CURRENCY
  // ============================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    // <h1>Booking Form</h1>
    <form
      className="booking-form"
      onSubmit={handleSubmit}
    >
      {/* ======================================================
          GUEST & ROOM
      ====================================================== */}

      <div className="form-section">
        <div className="form-section-header">
          <h3>Booking Details</h3>

          <p>
            Select guest and room for this booking
          </p>
        </div>

        <div className="form-grid">
          {/* Guest */}

          <div className="input-group">
            <label htmlFor="guestId">
              Guest <span>*</span>
            </label>

            <select
              id="guestId"
              name="guestId"
              value={formData.guestId}
              onChange={handleChange}
            >
              <option value="">
                Select guest
              </option>

              {guests?.data?.map((guest) => (
                <option
                  key={guest._id}
                  value={guest._id}
                >
                  {guest.name}
                  {guest.mobileNumber
                    ? ` - ${guest.mobileNumber}`
                    : ""}
                </option>
              ))}
            </select>

            {selectedGuest && (
              <small className="field-hint">
                {selectedGuest.email ||
                  selectedGuest.mobileNumber ||
                  ""}
              </small>
            )}
          </div>

          {/* Room */}

          <div className="input-group">
            <label htmlFor="roomId">
              Room <span>*</span>
            </label>

            <select
              id="roomId"
              name="roomId"
              value={formData.roomId}
              onChange={handleRoomChange}
            >
              <option value="">
                Select room
              </option>

              {rooms?.data?.filter(
                  (room) =>
                    room.status === "available" ||
                    room._id === formData.roomId
                )
                .map((room) => (
                  <option
                    key={room._id}
                    value={room._id}
                  >
                    Room {room.roomNumber} -{" "}
                    {room.roomType} -{" "}
                    {formatCurrency(
                      room.pricePerNight
                    )}
                  </option>
                ))}
            </select>

            {selectedRoom && (
              <small className="field-hint">
                {selectedRoom.roomType} · Capacity{" "}
                {selectedRoom.capacity || "—"}
              </small>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================
          STAY DETAILS
      ====================================================== */}

      <div className="form-section">
        <div className="form-section-header">
          <h3>Stay Details</h3>

          <p>
            Set check-in, check-out and guest count
          </p>
        </div>

        <div className="form-grid">
          {/* Check In */}

          <div className="input-group">
            <label htmlFor="checkInDate">
              Check-in Date <span>*</span>
            </label>

            <input
              id="checkInDate"
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              onChange={handleChange}
            />
          </div>

          {/* Check Out */}

          <div className="input-group">
            <label htmlFor="checkOutDate">
              Check-out Date <span>*</span>
            </label>

            <input
              id="checkOutDate"
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              min={
                formData.checkInDate ||
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              onChange={handleChange}
            />
          </div>

          {/* Adults */}

          <div className="input-group">
            <label htmlFor="adults">
              Adults
            </label>

            <input
              id="adults"
              type="number"
              name="adults"
              min="1"
              value={formData.adults}
              onChange={handleChange}
            />
          </div>

          {/* Children */}

          <div className="input-group">
            <label htmlFor="children">
              Children
            </label>

            <input
              id="children"
              type="number"
              name="children"
              min="0"
              value={formData.children}
              onChange={handleChange}
            />
          </div>

          {/* Nights */}

          <div className="input-group">
            <label htmlFor="nights">
              Nights
            </label>

            <input
              id="nights"
              type="number"
              value={formData.nights}
              readOnly
              className="readonly-input"
            />
          </div>

          {/* Room Rate */}

          <div className="input-group">
            <label htmlFor="roomRate">
              Room Rate / Night
            </label>

            <input
              id="roomRate"
              type="number"
              name="roomRate"
              value={formData.roomRate}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>
      </div>

      {/* ======================================================
          PRICE DETAILS
      ====================================================== */}

      <div className="form-section">
        <div className="form-section-header">
          <h3>Price Details</h3>

          <p>
            Review room charges, discount and tax
          </p>
        </div>

        <div className="form-grid">
          {/* Room Amount */}

          <div className="input-group">
            <label>Room Amount</label>

            <input
              type="text"
              value={formatCurrency(
                formData.roomAmount
              )}
              readOnly
              className="readonly-input"
            />
          </div>

          {/* Discount */}

          <div className="input-group">
            <label htmlFor="discount">
              Discount
            </label>

            <input
              id="discount"
              type="number"
              name="discount"
              min="0"
              value={formData.discount}
              onChange={handleChange}
            />
          </div>

          {/* Tax */}

          <div className="input-group">
            <label htmlFor="taxAmount">
              Tax Amount
            </label>

            <input
              id="taxAmount"
              type="number"
              name="taxAmount"
              min="0"
              value={formData.taxAmount}
              onChange={handleChange}
            />
          </div>

          {/* Total */}

          <div className="input-group">
            <label>Total Amount</label>

            <input
              type="text"
              value={formatCurrency(
                formData.totalAmount
              )}
              readOnly
              className="readonly-input total-input"
            />
          </div>

          {/* Paid */}

          <div className="input-group">
            <label htmlFor="paidAmount">
              Paid Amount
            </label>

            <input
              id="paidAmount"
              type="number"
              name="paidAmount"
              min="0"
              value={formData.paidAmount}
              onChange={handleChange}
            />
          </div>

          {/* Due */}

          <div className="input-group">
            <label>Due Amount</label>

            <input
              type="text"
              value={formatCurrency(
                formData.dueAmount
              )}
              readOnly
              className="readonly-input due-input"
            />
          </div>
        </div>

        {/* TOTAL SUMMARY */}

        <div className="booking-total-card">
          <div>
            <span>Total Amount</span>

            <strong>
              {formatCurrency(
                formData.totalAmount
              )}
            </strong>
          </div>

          <div>
            <span>Paid</span>

            <strong>
              {formatCurrency(
                formData.paidAmount
              )}
            </strong>
          </div>

          <div>
            <span>Due</span>

            <strong>
              {formatCurrency(
                formData.dueAmount
              )}
            </strong>
          </div>
        </div>
      </div>

      {/* ======================================================
          BOOKING STATUS
      ====================================================== */}

      <div className="form-section">
        <div className="form-section-header">
          <h3>Booking Status</h3>

          <p>
            Manage booking status and booking source
          </p>
        </div>

        <div className="form-grid">
          {/* Booking Status */}

          <div className="input-group">
            <label htmlFor="bookingStatus">
              Booking Status
            </label>

            <select
              id="bookingStatus"
              name="bookingStatus"
              value={formData.bookingStatus}
              onChange={handleChange}
            >
              <option value="pending">
                Pending
              </option>

              <option value="confirmed">
                Confirmed
              </option>

              <option value="checked_in">
                Checked In
              </option>

              <option value="checked_out">
                Checked Out
              </option>

              <option value="cancelled">
                Cancelled
              </option>

              <option value="no_show">
                No Show
              </option>
            </select>
          </div>

          {/* Payment Status */}

          <div className="input-group">
            <label>
              Payment Status
            </label>

            <input
              type="text"
              value={
                formData.paymentStatus
                  .replace("_", " ")
                  .replace(
                    /\b\w/g,
                    (char) =>
                      char.toUpperCase()
                  )
              }
              readOnly
              className="readonly-input"
            />
          </div>

          {/* Source */}

          <div className="input-group">
            <label htmlFor="source">
              Booking Source
            </label>

            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
            >
              <option value="walk_in">
                Walk In
              </option>

              <option value="phone">
                Phone
              </option>

              <option value="website">
                Website
              </option>

              <option value="online">
                Online
              </option>

              <option value="other">
                Other
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* ======================================================
          REQUESTS / NOTES
      ====================================================== */}

      <div className="form-section">
        <div className="form-section-header">
          <h3>Additional Information</h3>

          <p>
            Add guest requests or internal notes
          </p>
        </div>

        <div className="form-grid single-column">
          <div className="input-group">
            <label htmlFor="specialRequest">
              Special Request
            </label>

            <textarea
              id="specialRequest"
              name="specialRequest"
              value={formData.specialRequest}
              onChange={handleChange}
              placeholder="Example: Early check-in, extra bed..."
              rows="3"
            />
          </div>

          <div className="input-group">
            <label htmlFor="notes">
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Internal booking notes..."
              rows="3"
            />
          </div>
        </div>
      </div>

      {/* ======================================================
          ACTIONS
      ====================================================== */}

      <div className="booking-form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : booking
            ? "Update Booking"
            : "Create Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;