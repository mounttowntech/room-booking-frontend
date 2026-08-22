import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useDispatch } from "react-redux";

import {
  getBookings,
  deleteBooking,
  cancelBooking,
} from "../../redux/slices/bookingSlice";

import toast from "react-hot-toast";

import "./booking.css";
import BookingForm from "./BookingForm";
import Modal from "../../components/common/Modal";
import { formatBookingStatus } from "../../utils/bookingStatus";
import { formatCurrency } from "../../utils/currency";
import { formatBookingDate } from "../../utils/date";


// ============================================================
// BOOKING STATUS LABELS
// ============================================================

const bookingStatusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  checked_in: "Checked In",
  checked_out: "Checked Out",
  cancelled: "Cancelled",
  no_show: "No Show",
};


// ============================================================
// PAYMENT STATUS LABELS
// ============================================================

const paymentStatusLabels = {
  unpaid: "Unpaid",
  partial: "Partial",
  paid: "Paid",
  refunded: "Refunded",
};


// ============================================================
// SOURCE LABELS
// ============================================================

const sourceLabels = {
  walk_in: "Walk In",
  phone: "Phone",
  website: "Website",
  online: "Online",
  other: "Other",
};


const BookingList = () => {
  const dispatch = useDispatch();


  // ==========================================================
  // STATE
  // ==========================================================

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");

  const [bookingStatus, setBookingStatus] =
    useState("all");

  const [paymentStatus, setPaymentStatus] =
    useState("all");

  const [openActionId, setOpenActionId] =
    useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedBooking, setSelectedBooking] = useState(null);

  const [cancelBookingDetails, setCancelBookingDetails] = useState(null);

  const [viewBookingDetails, setViewBookingDetails] =
  useState(null);

  const [cancellationReason, setCancellationReason] =
  useState("");


  // ==========================================================
  // FETCH BOOKINGS
  // ==========================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);

      console.log("Fetching bookings...");

      const response =
        await dispatch(getBookings()).unwrap();

      console.log(
        "Fetched bookings:",
        response
      );


      // ------------------------------------------------------
      // Handle different backend response structures
      // ------------------------------------------------------

      const bookingData =
        response?.data?.bookings ||
        response?.data?.data ||
        response?.bookings ||
        response?.data ||
        response ||
        [];


      setBookings(
        Array.isArray(bookingData)
          ? bookingData
          : []
      );

    } catch (error) {

      console.error(
        "Failed to fetch bookings:",
        error
      );

      setBookings([]);

      toast.error(
        error ||
          "Failed to fetch bookings"
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchBookings();
  }, []);


  // ==========================================================
  // BOOKING STATUS COUNTS
  // ==========================================================

  const statusCounts = useMemo(() => {

    return {
      pending: bookings.filter(
        (booking) =>
          booking.bookingStatus ===
          "pending"
      ).length,

      confirmed: bookings.filter(
        (booking) =>
          booking.bookingStatus ===
          "confirmed"
      ).length,

      checked_in: bookings.filter(
        (booking) =>
          booking.bookingStatus ===
          "checked_in"
      ).length,

      checked_out: bookings.filter(
        (booking) =>
          booking.bookingStatus ===
          "checked_out"
      ).length,

      cancelled: bookings.filter(
        (booking) =>
          booking.bookingStatus ===
          "cancelled"
      ).length,

      no_show: bookings.filter(
        (booking) =>
          booking.bookingStatus ===
          "no_show"
      ).length,
    };

  }, [bookings]);


  // ==========================================================
  // PAYMENT COUNTS
  // ==========================================================

  const paymentCounts = useMemo(() => {

    return {
      unpaid: bookings.filter(
        (booking) =>
          booking.paymentStatus ===
          "unpaid"
      ).length,

      partial: bookings.filter(
        (booking) =>
          booking.paymentStatus ===
          "partial"
      ).length,

      paid: bookings.filter(
        (booking) =>
          booking.paymentStatus ===
          "paid"
      ).length,

      refunded: bookings.filter(
        (booking) =>
          booking.paymentStatus ===
          "refunded"
      ).length,
    };

  }, [bookings]);


  // ==========================================================
  // FILTER BOOKINGS
  // ==========================================================

  const filteredBookings = useMemo(() => {

    const searchValue =
      query.trim().toLowerCase();


    return bookings.filter(
      (booking) => {

        const bookingNumber =
          booking.bookingNo
            ?.toLowerCase() || "";


        const guestName =
          typeof booking.guestId ===
          "object"
            ? booking.guestId?.name
                ?.toLowerCase() || ""
            : "";


        const guestMobile =
          typeof booking.guestId ===
          "object"
            ? booking.guestId?.mobileNumber
                ?.toLowerCase() || ""
            : "";


        const roomNumber =
          typeof booking.roomId ===
          "object"
            ? String(
                booking.roomId?.roomNumber ||
                  ""
              ).toLowerCase()
            : "";


        const roomType =
          typeof booking.roomId ===
          "object"
            ? booking.roomId?.roomType
                ?.toLowerCase() || ""
            : "";


        const matchesSearch =
          !searchValue ||
          bookingNumber.includes(
            searchValue
          ) ||
          guestName.includes(
            searchValue
          ) ||
          guestMobile.includes(
            searchValue
          ) ||
          roomNumber.includes(
            searchValue
          ) ||
          roomType.includes(
            searchValue
          );


        const matchesBookingStatus =
          bookingStatus === "all" ||
          booking.bookingStatus ===
            bookingStatus;


        const matchesPaymentStatus =
          paymentStatus === "all" ||
          booking.paymentStatus ===
            paymentStatus;


        return (
          matchesSearch &&
          matchesBookingStatus &&
          matchesPaymentStatus
        );

      }
    );

  }, [
    bookings,
    query,
    bookingStatus,
    paymentStatus,
  ]);


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (date) => {

    if (!date) return "—";

    try {

      return new Intl.DateTimeFormat(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ).format(new Date(date));

    } catch {

      return "—";

    }

  };


  // ==========================================================
  // FORMAT CURRENCY
  // ==========================================================

  const formatCurrency = (amount) => {

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(amount || 0);

  };


  // ==========================================================
  // GUEST NAME
  // ==========================================================

  const getGuestName = (booking) => {

    if (
      booking.guestId &&
      typeof booking.guestId ===
        "object"
    ) {
      return (
        booking.guestId.name ||
        "Unknown Guest"
      );
    }

    return "Unknown Guest";

  };


  // ==========================================================
  // GUEST MOBILE
  // ==========================================================

  const getGuestMobile = (booking) => {

    if (
      booking.guestId &&
      typeof booking.guestId ===
        "object"
    ) {
      return (
        booking.guestId.mobileNumber ||
        ""
      );
    }

    return "";

  };


  // ==========================================================
  // ROOM NUMBER
  // ==========================================================

  const getRoomNumber = (booking) => {

    if (
      booking.roomId &&
      typeof booking.roomId ===
        "object"
    ) {
      return (
        booking.roomId.roomNumber ||
        "—"
      );
    }

    return "—";

  };


  // ==========================================================
  // ROOM TYPE
  // ==========================================================

  const getRoomType = (booking) => {

    if (
      booking.roomId &&
      typeof booking.roomId ===
        "object"
    ) {
      return (
        booking.roomId.roomType ||
        ""
      );
    }

    return "";

  };


  // ==========================================================
  // ADD BOOKING
  // ==========================================================

  const handleAddBooking = () => {

    // For now navigate to BookingForm later
    console.log(
      "Add booking clicked"
    );

    setSelectedBooking(null);
  setIsModalOpen(true);

    // Example:
    // navigate("/bookings/new");

  };


  // ==========================================================
  // VIEW BOOKING
  // ==========================================================

  const handleViewBooking = (booking) => {
    setViewBookingDetails(booking);

    setSelectedBooking(null);
    setCancelBookingDetails(null);

    setIsModalOpen(true);
  };


  // ==========================================================
  // EDIT BOOKING
  // ==========================================================

  const handleEditBooking = (booking) => {

    setOpenActionId(null);

    setSelectedBooking(booking);
     setViewBookingDetails(null);
  setCancelBookingDetails(null);
  setIsModalOpen(true);

    console.log(
      "Edit booking:",
      booking
    );

  };

  const handleClose = () => {
  setIsModalOpen(false);
  setSelectedBooking(null);
  setCancelBookingDetails(null);
  setViewBookingDetails(null);
  setCancellationReason("");
};


  // ==========================================================
  // DELETE BOOKING
  // ==========================================================

  const handleDeleteBooking = async (
    booking
  ) => {

    setOpenActionId(null);


    const confirmed =
      window.confirm(
        `Are you sure you want to delete booking ${booking.bookingNo}?`
      );


    if (!confirmed) return;


    try {

      const result =
        await dispatch(
          deleteBooking(
            booking._id
          )
        );


      if (
        deleteBooking.fulfilled.match(
          result
        )
      ) {

        toast.success(
          "Booking deleted successfully!"
        );

        fetchBookings();

      } else {

        toast.error(
          result.payload ||
            "Failed to delete booking"
        );

      }

    } catch (error) {

      console.error(
        "Failed to delete booking:",
        error
      );

      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to delete booking"
      );

    }

  };


  // ==========================================================
  // CANCEL BOOKING
  // ==========================================================

  const handleCancelBooking = async (
    booking
  ) => {

    setOpenActionId(null);



    const confirmed =
      window.confirm(
        `Are you sure you want to cancel booking ${booking.bookingNo}?`
      );


    if (!confirmed) return;


    try {

      setCancelBookingDetails(booking);
      setIsModalOpen(true);

      const result =
        await dispatch(
          cancelBooking(
            booking._id
          )
        );


      if (
        cancelBooking.fulfilled.match(
          result
        )
      ) {

        toast.success(
          "Booking canceled successfully!"
        );

        fetchBookings();

      } else {

        toast.error(
          result.payload ||
            "Failed to cancel booking"
        );

      }

    } catch (error) {

      console.error(
        "Failed to cancel booking:",
        error
      );

      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to cancel booking"
      );

    }

  };


const handleConfirmCancel = async () => {
  console.log("Confirm cancel booking:", cancellationReason);
  if (!cancellationReason.trim()) {
    toast.error(
      "Please enter cancellation reason"
    );
    return;
  }

  try {
    const result = await dispatch(
      cancelBooking({
        id: cancelBookingDetails._id,
        reason:
          cancellationReason.trim(),
      })
    );

    if (cancelBooking.fulfilled.match(result)) {
      toast.success(
        "Booking cancelled successfully"
      );

      handleClose();
      fetchBookings();
    } else {
      toast.error(
        result.payload ||
          "Failed to cancel booking"
      );
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        "Failed to cancel booking"
    );
  }
};


  const showCancelBooking = (booking) => {
  setCancelBookingDetails(booking);
  setSelectedBooking(null);
  setIsModalOpen(true);
};




  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <main className="booking-list-page">


      {/* ====================================================
          HEADER
      ==================================================== */}

      <header className="booking-list-header">

        <div>

          <p className="eyebrow">
            Front desk
          </p>

          <h1>
            Bookings
          </h1>

          <p className="subtitle">
            Manage reservations,
            check-ins and check-outs
          </p>

        </div>


        <button
          type="button"
          className="primary-button"
          onClick={
            handleAddBooking
          }
        >

          <span className="button-icon">
            +
          </span>

          New booking

        </button>

      </header>


      {/* ====================================================
          SUMMARY CARDS
      ==================================================== */}

      <section
        className="booking-summary"
        aria-label="Booking summary"
      >

        {/* Pending */}

        <button
          type="button"
          className={`summary-card ${
            bookingStatus ===
            "pending"
              ? "selected"
              : ""
          }`}
          onClick={() =>
            setBookingStatus(
              bookingStatus ===
                "pending"
                ? "all"
                : "pending"
            )
          }
        >

          <div className="summary-card-top">

            <span className="status-dot pending" />

            <span className="summary-label">
              Pending
            </span>

          </div>

          <strong>
            {statusCounts.pending}
          </strong>

        </button>


        {/* Confirmed */}

        <button
          type="button"
          className={`summary-card ${
            bookingStatus ===
            "confirmed"
              ? "selected"
              : ""
          }`}
          onClick={() =>
            setBookingStatus(
              bookingStatus ===
                "confirmed"
                ? "all"
                : "confirmed"
            )
          }
        >

          <div className="summary-card-top">

            <span className="status-dot confirmed" />

            <span className="summary-label">
              Confirmed
            </span>

          </div>

          <strong>
            {statusCounts.confirmed}
          </strong>

        </button>


        {/* Checked In */}

        <button
          type="button"
          className={`summary-card ${
            bookingStatus ===
            "checked_in"
              ? "selected"
              : ""
          }`}
          onClick={() =>
            setBookingStatus(
              bookingStatus ===
                "checked_in"
                ? "all"
                : "checked_in"
            )
          }
        >

          <div className="summary-card-top">

            <span className="status-dot checked_in" />

            <span className="summary-label">
              Checked In
            </span>

          </div>

          <strong>
            {statusCounts.checked_in}
          </strong>

        </button>


        {/* Checked Out */}

        <button
          type="button"
          className={`summary-card ${
            bookingStatus ===
            "checked_out"
              ? "selected"
              : ""
          }`}
          onClick={() =>
            setBookingStatus(
              bookingStatus ===
                "checked_out"
                ? "all"
                : "checked_out"
            )
          }
        >

          <div className="summary-card-top">

            <span className="status-dot checked_out" />

            <span className="summary-label">
              Checked Out
            </span>

          </div>

          <strong>
            {statusCounts.checked_out}
          </strong>

        </button>


        {/* Cancelled */}

        <button
          type="button"
          className={`summary-card ${
            bookingStatus ===
            "cancelled"
              ? "selected"
              : ""
          }`}
          onClick={() =>
            setBookingStatus(
              bookingStatus ===
                "cancelled"
                ? "all"
                : "cancelled"
            )
          }
        >

          <div className="summary-card-top">

            <span className="status-dot cancelled" />

            <span className="summary-label">
              Cancelled
            </span>

          </div>

          <strong>
            {statusCounts.cancelled}
          </strong>

        </button>

      </section>


      {/* ====================================================
          BOOKING LIST PANEL
      ==================================================== */}

      <section className="booking-list-panel">


        {/* ==================================================
            TOOLBAR
        ================================================== */}

        <div className="booking-list-toolbar">


          {/* SEARCH */}

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
                  setQuery(
                    event.target.value
                  )
                }
                placeholder="Search booking, guest or room"
                aria-label="Search bookings"
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

          </div>


          {/* FILTERS */}

          <div className="toolbar-right">


            {/* BOOKING STATUS */}

            <select
              value={
                bookingStatus
              }
              onChange={(event) =>
                setBookingStatus(
                  event.target.value
                )
              }
              aria-label="Filter booking status"
            >

              <option value="all">
                All statuses
              </option>

              {Object.entries(
                bookingStatusLabels
              ).map(
                ([
                  key,
                  label,
                ]) => (

                  <option
                    key={key}
                    value={key}
                  >
                    {label}
                  </option>

                )
              )}

            </select>


            {/* PAYMENT STATUS */}

            <select
              value={
                paymentStatus
              }
              onChange={(event) =>
                setPaymentStatus(
                  event.target.value
                )
              }
              aria-label="Filter payment status"
            >

              <option value="all">
                All payments
              </option>

              {Object.entries(
                paymentStatusLabels
              ).map(
                ([
                  key,
                  label,
                ]) => (

                  <option
                    key={key}
                    value={key}
                  >
                    {label}
                  </option>

                )
              )}

            </select>


            {/* REFRESH */}

            <button
              type="button"
              className="refresh-button"
              onClick={
                fetchBookings
              }
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

        <div className="booking-table-wrap">

          <table className="booking-table">

            <thead>

              <tr>

                <th>
                  Booking
                </th>

                <th>
                  Guest
                </th>

                <th>
                  Room
                </th>

                <th>
                  Check In
                </th>

                <th>
                  Check Out
                </th>

                <th>
                  Nights
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Payment
                </th>

                <th>
                  Status
                </th>

                <th className="actions-column">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>


              {/* ==================================================
                  LOADING
              ================================================== */}

              {loading ? (

                <tr>

                  <td
                    colSpan="10"
                    className="table-loading"
                  >

                    <div className="loading-spinner" />

                    Loading bookings...

                  </td>

                </tr>

              ) : filteredBookings.length >
                0 ? (


                /* ==================================================
                   BOOKINGS
                ================================================== */

                filteredBookings.map(
                  (booking) => (

                    <tr
                      key={
                        booking._id
                      }
                    >


                      {/* BOOKING */}

                      <td>

                        <div className="booking-number-cell">

                          <div className="booking-icon">
                            📋
                          </div>

                          <div>

                            <strong>
                              {
                                booking.bookingNo ||
                                "—"
                              }
                            </strong>

                            <span>
                              {
                                sourceLabels[
                                  booking
                                    .source
                                ] ||
                                booking.source ||
                                "Walk In"
                              }
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* GUEST */}

                      <td>

                        <div className="guest-cell">

                          <strong>
                            {
                              getGuestName(
                                booking
                              )
                            }
                          </strong>

                          {getGuestMobile(
                            booking
                          ) && (

                            <span>
                              {
                                getGuestMobile(
                                  booking
                                )
                              }
                            </span>

                          )}

                        </div>

                      </td>


                      {/* ROOM */}

                      <td>

                        <div className="booking-room-cell">

                          <strong>
                            Room{" "}
                            {
                              getRoomNumber(
                                booking
                              )
                            }
                          </strong>

                          <span>
                            {
                              getRoomType(
                                booking
                              )
                            }
                          </span>

                        </div>

                      </td>


                      {/* CHECK IN */}

                      <td>

                        <span className="date-text">

                          {
                            formatDate(
                              booking.checkInDate
                            )
                          }

                        </span>

                      </td>


                      {/* CHECK OUT */}

                      <td>

                        <span className="date-text">

                          {
                            formatDate(
                              booking.checkOutDate
                            )
                          }

                        </span>

                      </td>


                      {/* NIGHTS */}

                      <td>

                        <span className="nights-text">

                          {
                            booking.nights ||
                            0
                          }{" "}

                          {
                            booking.nights ===
                            1
                              ? "night"
                              : "nights"
                          }

                        </span>

                      </td>


                      {/* AMOUNT */}

                      <td>

                        <div className="amount-cell">

                          <strong>
                            {
                              formatCurrency(
                                booking.totalAmount
                              )
                            }
                          </strong>

                          {Number(
                            booking.dueAmount
                          ) > 0 && (

                            <span>
                              Due{" "}
                              {
                                formatCurrency(
                                  booking.dueAmount
                                )
                              }
                            </span>

                          )}

                        </div>

                      </td>


                      {/* PAYMENT */}

                      <td>

                        <span
                          className={`payment-badge ${
                            booking.paymentStatus ||
                            "unpaid"
                          }`}
                        >

                          <span className="payment-dot" />

                          {
                            paymentStatusLabels[
                              booking
                                .paymentStatus
                            ] ||
                            booking.paymentStatus ||
                            "Unpaid"
                          }

                        </span>

                      </td>


                      {/* BOOKING STATUS */}

                      <td>

                        <span
                          className={`booking-status-badge ${
                            booking.bookingStatus ||
                            "pending"
                          }`}
                        >

                          <span className="status-dot" />

                          {
                            bookingStatusLabels[
                              booking
                                .bookingStatus
                            ] ||
                            booking.bookingStatus ||
                            "Pending"
                          }

                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td className="actions-column">

                        <div className="booking-actions">


                          <button
                            type="button"
                            className="more-button"
                            aria-label={`Actions for ${booking.bookingNo}`}
                            onClick={() =>
                              setOpenActionId(
                                openActionId ===
                                  booking._id
                                  ? null
                                  : booking._id
                              )
                            }
                          >
                            ⋮
                          </button>


                          {openActionId ===
                            booking._id && (

                            <div className="action-menu">


                              {/* VIEW */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleViewBooking(
                                    booking
                                  )
                                }
                              >

                                <span>
                                  👁
                                </span>

                                View booking

                              </button>


                              {/* EDIT */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleEditBooking(
                                    booking
                                  )
                                }
                              >

                                <span>
                                  ✎
                                </span>

                                Edit booking

                              </button>


                              {/* CANCEL */}

                              <button
                                type="button"
                                className="danger-action"
                                onClick={() =>
                                  showCancelBooking(
                                    booking
                                  )
                                }
                              >

                                <span>
                                  ⌫
                                </span>

                                Cancel booking

                              </button>


                            </div>

                          )}

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (


                /* ==================================================
                   EMPTY STATE
                ================================================== */

                <tr>

                  <td
                    colSpan="10"
                    className="empty-state-cell"
                  >

                    <div className="empty-state">

                      <div className="empty-icon">
                        📋
                      </div>

                      <h3>
                        No bookings found
                      </h3>

                      <p>

                        {query ||
                        bookingStatus !==
                          "all" ||
                        paymentStatus !==
                          "all"
                          ? "Try changing your search or filters."
                          : "Start by creating your first booking."}

                      </p>


                      {!query &&
                        bookingStatus ===
                          "all" &&
                        paymentStatus ===
                          "all" && (

                          <button
                            type="button"
                            className="primary-button"
                            onClick={
                              handleAddBooking
                            }
                          >

                            <span>
                              +
                            </span>

                            New booking

                          </button>

                        )}

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* ==================================================
            FOOTER
        ================================================== */}

        {!loading &&
          bookings.length >
            0 && (

            <div className="booking-list-footer">

              <span>

                Showing{" "}

                <strong>
                  {
                    filteredBookings.length
                  }
                </strong>

                {" "}of{" "}

                <strong>
                  {
                    bookings.length
                  }
                </strong>

                {" "}bookings

              </span>

            </div>

          )}

      </section>


{/* cancel booking modal show booking details with reason for cancellation and confirm cancel button. */}
      {/* <Modal
  isOpen={isModalOpen}
  onClose={handleClose}
  title={
    selectedBooking
      ? "Edit Booking"
      : "New Booking"
  }
  width="900px"
>
{ cancelBookingDetails && (
  <div>
    <h3>Cancel Booking</h3>
    <p>Are you sure you want to cancel this booking?</p>
    <p><strong>Reason:</strong> {cancelBookingDetails.cancellationReason}</p>
    <button onClick={handleConfirmCancel}>Confirm Cancel</button>
  </div>
)} :
  <BookingForm
    booking={selectedBooking}
    onSuccess={() => {
      handleClose();
      fetchBookings();
    }}
    onClose={handleClose}
  />
</Modal> */}

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={
          viewBookingDetails
            ? "Booking Details"
            : cancelBookingDetails
              ? "Cancel Booking"
              : selectedBooking
                ? "Edit Booking"
                : "New Booking"
        }
        width="900px"
      >
        {/* ======================================================
      VIEW BOOKING
  ====================================================== */}

        {viewBookingDetails ? (
          <div className="view-booking-modal">

            {/* HEADER */}

            <div className="view-booking-header">

              <div>
                <p className="booking-detail-eyebrow">
                  Booking
                </p>

                <h3>
                  {viewBookingDetails.bookingNo || "—"}
                </h3>
              </div>

              <span
                className={`booking-status-badge ${viewBookingDetails.bookingStatus ||
                  "pending"
                  }`}
              >
                {formatBookingStatus(
                  viewBookingDetails.bookingStatus
                )}
              </span>

            </div>


            {/* ==================================================
          GUEST & ROOM
      ================================================== */}

            <div className="view-booking-section">

              <h4>Guest & Room</h4>

              <div className="booking-details-grid">

                {/* Guest */}

                <div className="booking-detail-item">

                  <span>Guest</span>

                  <strong>
                    {viewBookingDetails.guestId?.name ||
                      viewBookingDetails.guest?.name ||
                      "—"}
                  </strong>

                </div>


                {/* Mobile */}

                <div className="booking-detail-item">

                  <span>Mobile Number</span>

                  <strong>
                    {viewBookingDetails.guestId
                      ?.mobileNumber ||
                      viewBookingDetails.guest
                        ?.mobileNumber ||
                      "—"}
                  </strong>

                </div>


                {/* Email */}

                <div className="booking-detail-item">

                  <span>Email</span>

                  <strong>
                    {viewBookingDetails.guestId?.email ||
                      viewBookingDetails.guest?.email ||
                      "—"}
                  </strong>

                </div>


                {/* Room */}

                <div className="booking-detail-item">

                  <span>Room</span>

                  <strong>
                    {viewBookingDetails.roomId
                      ?.roomNumber
                      ? `Room ${viewBookingDetails.roomId.roomNumber}`
                      : viewBookingDetails.room
                        ?.roomNumber
                        ? `Room ${viewBookingDetails.room.roomNumber}`
                        : "—"}
                  </strong>

                </div>


                {/* Room Type */}

                <div className="booking-detail-item">

                  <span>Room Type</span>

                  <strong>
                    {viewBookingDetails.roomId
                      ?.roomType ||
                      viewBookingDetails.room
                        ?.roomType ||
                      "—"}
                  </strong>

                </div>


                {/* Room Rate */}

                <div className="booking-detail-item">

                  <span>Room Rate</span>

                  <strong>
                    {formatCurrency(
                      viewBookingDetails.roomRate
                    )}
                    {" / night"}
                  </strong>

                </div>

              </div>

            </div>


            {/* ==================================================
          STAY DETAILS
      ================================================== */}

            <div className="view-booking-section">

              <h4>Stay Details</h4>

              <div className="booking-details-grid">

                <div className="booking-detail-item">

                  <span>Check-in</span>

                  <strong>
                    {formatBookingDate(
                      viewBookingDetails.checkInDate
                    )}
                  </strong>

                </div>


                <div className="booking-detail-item">

                  <span>Check-out</span>

                  <strong>
                    {formatBookingDate(
                      viewBookingDetails.checkOutDate
                    )}
                  </strong>

                </div>


                <div className="booking-detail-item">

                  <span>Nights</span>

                  <strong>
                    {viewBookingDetails.nights || 0}
                  </strong>

                </div>


                <div className="booking-detail-item">

                  <span>Adults</span>

                  <strong>
                    {viewBookingDetails.adults || 0}
                  </strong>

                </div>


                <div className="booking-detail-item">

                  <span>Children</span>

                  <strong>
                    {viewBookingDetails.children || 0}
                  </strong>

                </div>


                <div className="booking-detail-item">

                  <span>Booking Source</span>

                  <strong>
                    {formatBookingStatus(
                      viewBookingDetails.source
                    )}
                  </strong>

                </div>

              </div>

            </div>


            {/* ==================================================
          PAYMENT DETAILS
      ================================================== */}

            <div className="view-booking-section">

              <h4>Payment Details</h4>

              <div className="booking-details-grid">

                <div className="booking-detail-item">

                  <span>Room Amount</span>

                  <strong>
                    {formatCurrency(
                      viewBookingDetails.roomAmount
                    )}
                  </strong>

                </div>


                <div className="booking-detail-item">

                  <span>Discount</span>

                  <strong>
                    {formatCurrency(
                      viewBookingDetails.discount
                    )}
                  </strong>

                </div>


                <div className="booking-detail-item">

                  <span>Tax</span>

                  <strong>
                    {formatCurrency(
                      viewBookingDetails.taxAmount
                    )}
                  </strong>

                </div>


                <div className="booking-detail-item">

                  <span>Total Amount</span>

                  <strong className="booking-total-value">
                    {formatCurrency(
                      viewBookingDetails.totalAmount
                    )}
                  </strong>

                </div>


                <div className="booking-detail-item">

                  <span>Paid Amount</span>

                  <strong className="booking-paid-value">
                    {formatCurrency(
                      viewBookingDetails.paidAmount
                    )}
                  </strong>

                </div>


                <div className="booking-detail-item">

                  <span>Due Amount</span>

                  <strong className="booking-due-value">
                    {formatCurrency(
                      viewBookingDetails.dueAmount
                    )}
                  </strong>

                </div>

              </div>

            </div>


            {/* ==================================================
          STATUS
      ================================================== */}

            <div className="view-booking-section">

              <h4>Status</h4>

              <div className="booking-status-row">

                <div>

                  <span>Booking Status</span>

                  <strong
                    className={`booking-status-text ${viewBookingDetails.bookingStatus
                      }`}
                  >
                    {formatBookingStatus(
                      viewBookingDetails.bookingStatus
                    )}
                  </strong>

                </div>


                <div>

                  <span>Payment Status</span>

                  <strong
                    className={`payment-status-text ${viewBookingDetails.paymentStatus
                      }`}
                  >
                    {formatBookingStatus(
                      viewBookingDetails.paymentStatus
                    )}
                  </strong>

                </div>

              </div>

            </div>


            {/* ==================================================
          SPECIAL REQUEST
      ================================================== */}

            {(viewBookingDetails.specialRequest ||
              viewBookingDetails.notes) && (

                <div className="view-booking-section">

                  <h4>Additional Information</h4>

                  {viewBookingDetails.specialRequest && (
                    <div className="booking-note">

                      <span>
                        Special Request
                      </span>

                      <p>
                        {viewBookingDetails.specialRequest}
                      </p>

                    </div>
                  )}

                  {viewBookingDetails.notes && (
                    <div className="booking-note">

                      <span>
                        Notes
                      </span>

                      <p>
                        {viewBookingDetails.notes}
                      </p>

                    </div>
                  )}

                </div>

              )}


            {/* ==================================================
          CANCELLATION DETAILS
      ================================================== */}

            {viewBookingDetails.bookingStatus ===
              "cancelled" && (

                <div className="view-booking-section">

                  <h4>Cancellation Details</h4>

                  <div className="cancellation-view-box">

                    <div>
                      <span>Cancelled At</span>

                      <strong>
                        {formatBookingDate(
                          viewBookingDetails.cancelledAt
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Cancellation Reason</span>

                      <p>
                        {viewBookingDetails.cancellationReason ||
                          "No reason provided"}
                      </p>
                    </div>

                  </div>

                </div>

              )}


            {/* ==================================================
          ACTIONS
      ================================================== */}

            <div className="view-booking-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={handleClose}
              >
                Close
              </button>

              {viewBookingDetails.bookingStatus !==
                "cancelled" && (

                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      handleEditBooking(
                        viewBookingDetails
                      )
                    }
                  >
                    Edit Booking
                  </button>

                )}

            </div>

          </div>

        ) : cancelBookingDetails ? (

          /* ======================================================
             CANCEL BOOKING
          ====================================================== */

          <div className="cancel-booking-modal">

            <div className="cancel-booking-header">

              <div className="cancel-booking-icon">
                !
              </div>

              <div>

                <h3>
                  Cancel Booking
                </h3>

                <p>
                  Are you sure you want to cancel
                  this booking?
                </p>

              </div>

            </div>


            {/* BOOKING DETAILS */}

            <div className="cancel-booking-details">

              <div className="booking-detail-item">

                <span>Booking No</span>

                <strong>
                  {cancelBookingDetails.bookingNo ||
                    "—"}
                </strong>

              </div>


              <div className="booking-detail-item">

                <span>Guest</span>

                <strong>
                  {cancelBookingDetails.guestId?.name ||
                    cancelBookingDetails.guest?.name ||
                    "—"}
                </strong>

              </div>


              <div className="booking-detail-item">

                <span>Room</span>

                <strong>
                  {cancelBookingDetails.roomId
                    ?.roomNumber
                    ? `Room ${cancelBookingDetails.roomId.roomNumber}`
                    : cancelBookingDetails.room
                      ?.roomNumber
                      ? `Room ${cancelBookingDetails.room.roomNumber}`
                      : "—"}
                </strong>

              </div>


              <div className="booking-detail-item">

                <span>Check-in</span>

                <strong>
                  {formatBookingDate(
                    cancelBookingDetails.checkInDate
                  )}
                </strong>

              </div>


              <div className="booking-detail-item">

                <span>Check-out</span>

                <strong>
                  {formatBookingDate(
                    cancelBookingDetails.checkOutDate
                  )}
                </strong>

              </div>


              <div className="booking-detail-item">

                <span>Total Amount</span>

                <strong>
                  {formatCurrency(
                    cancelBookingDetails.totalAmount
                  )}
                </strong>

              </div>

            </div>


            {/* CANCELLATION REASON */}

            <div className="cancellation-reason-box">

              <label htmlFor="cancellationReason">

                Cancellation Reason{" "}

                <span>*</span>

              </label>

              <textarea
                id="cancellationReason"
                value={cancellationReason}
                onChange={(e) =>
                  setCancellationReason(
                    e.target.value
                  )
                }
                placeholder="Enter reason for cancellation..."
                rows={4}
              />

            </div>


            {/* WARNING */}

            <div className="cancel-booking-warning">

              <span>⚠</span>

              <p>
                This action will cancel the booking.
                Please confirm that you want to
                continue.
              </p>

            </div>


            {/* ACTIONS */}

            <div className="cancel-booking-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={handleClose}
              >
                Keep Booking
              </button>

              <button
                type="button"
                className="danger-button"
                onClick={handleConfirmCancel}
              >
                Confirm Cancel
              </button>

            </div>

          </div>

        ) : (

          /* ======================================================
             ADD / EDIT BOOKING
          ====================================================== */

          <BookingForm
            booking={selectedBooking}
            onSuccess={() => {
              handleClose();
              fetchBookings();
            }}
            onClose={handleClose}
          />

        )}

      </Modal>

    </main>
  );
};


export default BookingList;