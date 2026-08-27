import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import Modal from "../../components/common/Modal";
import PaymentForm from "./PaymentForm";


import "./payments.css";
import { getPayments, getPaymentSummary } from "../../redux/slices/paymentSlice";

const paymentStatusLabels = {
  unpaid: "Unpaid",
  partial: "Partial",
  paid: "Paid",
  refunded: "Refunded",
};

const PaymentList = () => {
  const dispatch = useDispatch();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const [selectedPayment, setSelectedPayment] = useState(null);

  const [viewPayment, setViewPayment] = useState(null);
  const [collectPayment, setCollectPayment] = useState(null);

  const [openActionId, setOpenActionId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // ============================================================
  // FETCH PAYMENTS
  // ============================================================

  const fetchPaymentSummary = async () => {
    try {
      setLoading(true);

      const result = await dispatch(getPaymentSummary()).unwrap();

      console.log("Payment API response:", result);

      const paymentData =
        result?.data?.payments ||
        result?.data?.data ||
        result?.data ||
        [];

      setPayments(
        Array.isArray(paymentData)
          ? paymentData
          : []
      );
    } catch (error) {
      console.error("Failed to fetch payments:", error);

      toast.error(
        error || "Failed to fetch payments"
      );

      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

//    const fetchPayments = async () => {
//     try {
//       setLoading(true);

//       const result = await dispatch(getPayments()).unwrap();

//       console.log("Payment API response:", result);

//       const paymentData =
//         result?.data?.payments ||
//         result?.data?.data ||
//         result?.data ||
//         [];

//       setPayments(
//         Array.isArray(paymentData)
//           ? paymentData
//           : []
//       );
//     } catch (error) {
//       console.error("Failed to fetch payments:", error);

//       toast.error(
//         error || "Failed to fetch payments"
//       );

//       setPayments([]);
//     } finally {
//       setLoading(false);
//     }
//   };

  useEffect(() => {
    fetchPaymentSummary();
  }, []);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredPayments = useMemo(() => {
    const search = query
      .trim()
      .toLowerCase();

    return payments.filter((payment) => {
      const booking =
        payment.bookingId || payment.booking;

      const guest =
        payment.guestId || payment.guest;

      const room =
        payment.roomId || payment.room;

      const matchesSearch =
        !search ||
        booking?.bookingNo
          ?.toLowerCase()
          .includes(search) ||
        guest?.name
          ?.toLowerCase()
          .includes(search) ||
        room?.roomNumber
          ?.toString()
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        status === "all" ||
        payment.paymentStatus === status;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [payments, query, status]);

  // ============================================================
      // PAGINATION
      // ============================================================
      
      const totalItems = filteredPayments.length;
      
      const totalPages = Math.ceil(
        totalItems / itemsPerPage
      );
      
      const startIndex =
        (currentPage - 1) * itemsPerPage;
      
      const endIndex =
        startIndex + itemsPerPage;
      
      const paginatedPayments =
        filteredPayments.slice(
          startIndex,
          endIndex
        );
      
      
        useEffect(() => {
        setCurrentPage(1);
      }, [query, status, itemsPerPage]);

  // ============================================================
  // CURRENCY
  // ============================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  // ============================================================
  // VIEW PAYMENT
  // ============================================================

  const handleViewPayment = async (payment) => {
    console.log("Viewing payment:", payment);
    setOpenActionId(null);

    try {
      /*
       * If your API has getPaymentDetails,
       * use it here.
       */

    //   const result = await dispatch(
    //     getPaymentDetails(
    //       payment._id
    //     )
    //   ).unwrap();

    //   const details =
    //     result?.data?.payment ||
    //     result?.data ||
    //     result;

      setViewPayment(payment);
    } catch (error) {
      console.error(
        "Failed to get payment details:",
        error
      );

      /*
       * Fallback to row data.
       */
      setViewPayment(payment);
    }
  };

  // ============================================================
  // COLLECT PAYMENT
  // ============================================================

  const handleCollectPayment = (payment) => {
    setOpenActionId(null);

    setCollectPayment(payment);
  };

  // ============================================================
  // CLOSE MODALS
  // ============================================================

  const closeViewPayment = () => {
    setViewPayment(null);
  };

  const closeCollectPayment = () => {
    setCollectPayment(null);
  };

  // ============================================================
  // PAYMENT SUCCESS
  // ============================================================

  const handlePaymentSuccess = () => {
    closeCollectPayment();

    fetchPaymentSummary();

    toast.success(
      "Payment collected successfully!"
    );
  };

  // ============================================================
  // SUMMARY
  // ============================================================

  const summary = useMemo(() => {
    let total = 0;
    let paid = 0;
    let due = 0;

    payments.forEach((payment) => {
      total +=
        Number(
          payment.totalAmount ||
          payment.bookingId?.totalAmount ||
          payment.booking?.totalAmount ||
          0
        );

      paid +=
        Number(
          payment.paidAmount ||
          payment.amountPaid ||
          0
        );

      due +=
        Number(
          payment.dueAmount ||
          0
        );
    });

    return {
      total,
      paid,
      due,
    };
  }, [payments]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="payment-list-page">

      {/* HEADER */}

      <header className="payment-list-header">

        <div>
          <p className="eyebrow">
            Front desk
          </p>

          <h1>Payments</h1>

          <p className="subtitle">
            Manage booking payments and
            outstanding balances
          </p>
        </div>

        {/* <button
          type="button"
          className="primary-button"
          onClick={() => {
            if (payments.length > 0) {
              handleCollectPayment(
                payments.find(
                  (item) =>
                    Number(
                      item.dueAmount || 0
                    ) > 0
                ) || payments[0]
              );
            }
          }}
        >
          <span className="button-icon">
            +
          </span>

          Collect Payment
        </button> */}

      </header>

      {/* SUMMARY */}

      <section className="payment-summary">

        <div className="payment-summary-card">
          <span>Total Amount</span>

          <strong>
            {formatCurrency(
              summary.total
            )}
          </strong>
        </div>

        <div className="payment-summary-card paid">
          <span>Total Paid</span>

          <strong>
            {formatCurrency(
              summary.paid
            )}
          </strong>
        </div>

        <div className="payment-summary-card due">
          <span>Total Due</span>

          <strong>
            {formatCurrency(
              summary.due
            )}
          </strong>
        </div>

      </section>

      {/* LIST */}

      <section className="payment-list-panel">

        {/* TOOLBAR */}

        <div className="payment-list-toolbar">

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
              placeholder="Search booking, guest or room"
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

          <div className="toolbar-right">

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
            >
              <option value="all">
                All payments
              </option>

              <option value="unpaid">
                Unpaid
              </option>

              <option value="partial">
                Partial
              </option>

              <option value="paid">
                Paid
              </option>

              <option value="refunded">
                Refunded
              </option>
            </select>

            <button
              type="button"
              className="refresh-button"
              onClick={fetchPaymentSummary}
              disabled={loading}
            >
              ↻
            </button>

          </div>

        </div>

        {/* TABLE */}

        <div className="payment-table-wrap">

          <table className="payment-table">

            <thead>
              <tr>

                <th>Booking</th>

                <th>Guest</th>

                <th>Room</th>

                <th>Total</th>

                <th>Paid</th>

                <th>Due</th>

                <th>Status</th>

                <th>Actions</th>

              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="8"
                    className="table-loading"
                  >
                    Loading payments...
                  </td>
                </tr>

              ) : paginatedPayments.length > 0 ? (

                paginatedPayments.map(
                  (payment) => {

                    const booking =
                      payment.bookingId ||
                      payment.booking;

                    const guest =
                      payment.guestId ||
                      payment.guest;

                    const room =
                      payment.roomId ||
                      payment.room;

                    const total =
                      payment.totalAmount ||
                      booking?.totalAmount ||
                      0;

                    const paid =
                      payment.paidAmount ||
                      payment.amountPaid ||
                      0;

                    const due =
                      payment.dueAmount ??
                      Math.max(
                        Number(total) -
                          Number(paid),
                        0
                      );

                    const paymentStatus =
                      payment.paymentStatus ||
                      booking?.paymentStatus ||
                      (
                        due === 0
                          ? "paid"
                          : paid > 0
                          ? "partial"
                          : "unpaid"
                      );

                    return (
                      <tr
                        key={payment._id}
                      >

                        {/* BOOKING */}

                        <td>
                          <div className="booking-number-cell">

                            <strong>
                              {booking?.bookingNo ||
                                payment.bookingNo ||
                                "—"}
                            </strong>

                          </div>
                        </td>

                        {/* GUEST */}

                        <td>
                          <div className="guest-cell">

                            <strong>
                              {guest?.name ||
                                "—"}
                            </strong>

                            {guest?.mobileNumber && (
                              <span>
                                {guest.mobileNumber}
                              </span>
                            )}

                          </div>
                        </td>

                        {/* ROOM */}

                        <td>
                          {room?.roomNumber
                            ? `Room ${room.roomNumber}`
                            : "—"}
                        </td>

                        {/* TOTAL */}

                        <td>
                          <strong>
                            {formatCurrency(
                              total
                            )}
                          </strong>
                        </td>

                        {/* PAID */}

                        <td>
                          <span className="paid-amount">
                            {formatCurrency(
                              paid
                            )}
                          </span>
                        </td>

                        {/* DUE */}

                        <td>
                          <span
                            className={
                              due > 0
                                ? "due-amount"
                                : "paid-amount"
                            }
                          >
                            {formatCurrency(
                              due
                            )}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`payment-status-badge ${paymentStatus}`}
                          >
                            <span className="status-dot" />

                            {paymentStatusLabels[
                              paymentStatus
                            ] ||
                              paymentStatus}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td>

                          <div className="payment-actions">

                            <button
                              type="button"
                              className="more-button"
                              onClick={() =>
                                setOpenActionId(
                                  openActionId ===
                                    payment._id
                                    ? null
                                    : payment._id
                                )
                              }
                            >
                              ⋮
                            </button>

                            {openActionId ===
                              payment._id && (

                              <div className="action-menu">

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleViewPayment(
                                      payment
                                    )
                                  }
                                >
                                  <span>
                                    ◉
                                  </span>

                                  View Payment
                                </button>

                                {Number(due) >
                                  0 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCollectPayment(
                                        payment
                                      )
                                    }
                                  >
                                    <span>
                                      ₹
                                    </span>

                                    Collect Payment
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
                    colSpan="8"
                    className="empty-state-cell"
                  >
                    <div className="empty-state">

                      <div className="empty-icon">
                        ₹
                      </div>

                      <h3>
                        No payments found
                      </h3>

                      <p>
                        Try changing your
                        search or filter.
                      </p>

                    </div>
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* ======================================================
          footer with pagination
        ====================================================== */}

        {!loading && paginatedPayments.length > 0 && (

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
          VIEW PAYMENT MODAL
      ====================================================== */}

      <Modal
        isOpen={!!viewPayment}
        onClose={closeViewPayment}
        title="Payment Details"
        width="800px"
      >

        {viewPayment && (
          <PaymentDetailsContent
            payment={viewPayment}
            formatCurrency={
              formatCurrency
            }
            onCollect={() => {
              closeViewPayment();

              setCollectPayment(
                viewPayment
              );
            }}
          />
        )}

      </Modal>

      {/* ======================================================
          COLLECT PAYMENT MODAL
      ====================================================== */}

      <Modal
        isOpen={!!collectPayment}
        onClose={closeCollectPayment}
        title="Collect Payment"
        width="650px"
      >

        {collectPayment && (
          <PaymentForm
            payment={collectPayment}
            onSuccess={
              handlePaymentSuccess
            }
            onClose={
              closeCollectPayment
            }
          />
        )}

      </Modal>

    </main>
  );
};

const PaymentDetailsContent = ({
  payment,
  formatCurrency,
  onCollect,
}) => {

  const booking =
    payment.bookingId ||
    payment.booking;

  const guest =
    payment.guestId ||
    payment.guest;

  const room =
    payment.roomId ||
    payment.room;

  const total =
    payment.totalAmount ||
    booking?.totalAmount ||
    0;

  const paid =
    payment.paidAmount ||
    payment.amountPaid ||
    0;

  const due =
    payment.dueAmount ??
    Math.max(
      Number(total) -
        Number(paid),
      0
    );

  const status =
    payment.paymentStatus ||
    booking?.paymentStatus ||
    "unpaid";

  return (
    <div className="payment-details-modal">

      {/* HEADER */}

      <div className="payment-details-header">

        <div>
          <span className="detail-label">
            Booking
          </span>

          <h3>
            {booking?.bookingNo ||
              payment.bookingNo ||
              "—"}
          </h3>
        </div>

        <span
          className={`payment-status-badge ${status}`}
        >
          <span className="status-dot" />

          {paymentStatusLabels[
            status
          ] || status}
        </span>

      </div>

      {/* BOOKING DETAILS */}

      <div className="payment-detail-grid">

        <div>
          <span>Guest</span>

          <strong>
            {guest?.name || "—"}
          </strong>
        </div>

        <div>
          <span>Room</span>

          <strong>
            {room?.roomNumber
              ? `Room ${room.roomNumber}`
              : "—"}
          </strong>
        </div>

        <div>
          <span>Check-in</span>

          <strong>
            {payment?.checkInDate
              ? new Date(
                  payment.checkInDate
                ).toLocaleDateString(
                  "en-IN"
                )
              : "—"}
          </strong>
        </div>

        <div>
          <span>Check-out</span>

          <strong>
            {payment?.checkOutDate
              ? new Date(
                  payment.checkOutDate
                ).toLocaleDateString(
                  "en-IN"
                )
              : "—"}
          </strong>
        </div>

      </div>

      {/* PAYMENT SUMMARY */}

      <div className="payment-summary-box">

        <div>
          <span>
            Room Amount
          </span>

          <strong>
            {formatCurrency(
              booking?.roomAmount || 0
            )}
          </strong>
        </div>

        <div>
          <span>
            Discount
          </span>

          <strong>
            -{" "}
            {formatCurrency(
              booking?.discount || 0
            )}
          </strong>
        </div>

        <div>
          <span>
            Tax
          </span>

          <strong>
            {formatCurrency(
              booking?.taxAmount || 0
            )}
          </strong>
        </div>

        <div className="total-row">
          <span>
            Total Amount
          </span>

          <strong>
            {formatCurrency(total)}
          </strong>
        </div>

        <div className="paid-row">
          <span>
            Paid Amount
          </span>

          <strong>
            {formatCurrency(paid)}
          </strong>
        </div>

        <div className="due-row">
          <span>
            Due Amount
          </span>

          <strong>
            {formatCurrency(due)}
          </strong>
        </div>

      </div>

      {/* PAYMENT TRANSACTION */}

      <div className="payment-history-section">

        <h3>
          Payment Information
        </h3>

        <div className="payment-history-item">

          <div>
            <span>
              Payment Method
            </span>

            <strong>
              {payment.paymentMethod ||
                "—"}
            </strong>
          </div>

          <div>
            <span>
              Amount
            </span>

            <strong>
              {formatCurrency(
                payment.amount ||
                  payment.amountPaid ||
                  0
              )}
            </strong>
          </div>

          <div>
            <span>
              Payment Date
            </span>

            <strong>
              {payment.paymentDate
                ? new Date(
                    payment.paymentDate
                  ).toLocaleDateString(
                    "en-IN"
                  )
                : "—"}
            </strong>
          </div>

          <div>
            <span>
              Reference
            </span>

            <strong>
              {payment.referenceNumber ||
                "—"}
            </strong>
          </div>

        </div>

      </div>

      {/* ACTIONS */}

      <div className="payment-modal-actions">

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            window.history.back()
          }
        >
          Close
        </button>

        {Number(due) > 0 && (
          <button
            type="button"
            className="primary-button"
            onClick={onCollect}
          >
            Collect Payment
          </button>
        )}

      </div>

    </div>
  );
};

export default PaymentList;