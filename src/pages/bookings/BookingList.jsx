import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useDispatch } from "react-redux";

import {
  getBookings,
  deleteBooking,
} from "../../redux/slices/bookingSlice";

import toast from "react-hot-toast";

import "./booking.css";
import BookingForm from "./BookingForm";
import Modal from "../../components/common/Modal";


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

  const handleViewBooking = (
    booking
  ) => {

    setOpenActionId(null);

    console.log(
      "View booking:",
      booking
    );

  };


  // ==========================================================
  // EDIT BOOKING
  // ==========================================================

  const handleEditBooking = (
    booking
  ) => {

    setOpenActionId(null);

    setSelectedBooking(booking);
  setIsModalOpen(true);

    console.log(
      "Edit booking:",
      booking
    );

  };

  const handleClose = () => {
  setIsModalOpen(false);
  setSelectedBooking(null);
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


                              {/* DELETE */}

                              <button
                                type="button"
                                className="danger-action"
                                onClick={() =>
                                  handleDeleteBooking(
                                    booking
                                  )
                                }
                              >

                                <span>
                                  ⌫
                                </span>

                                Delete booking

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


      <Modal
  isOpen={isModalOpen}
  onClose={handleClose}
  title={
    selectedBooking
      ? "Edit Booking"
      : "New Booking"
  }
  width="900px"
>
  <BookingForm
    booking={selectedBooking}
    onSuccess={() => {
      handleClose();
      fetchBookings();
    }}
    onClose={handleClose}
  />
</Modal>

    </main>
  );
};


export default BookingList;