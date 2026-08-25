// src/pages/invoices/InvoiceDetails.jsx

import React from "react";

import "./invoices.css";

const InvoiceDetails = ({
  invoice,
  onClose,
}) => {

  if (!invoice) {
    return null;
  }

  // ==========================================================
  // DATA
  // ==========================================================
console.log("invoice invoice prop:", invoice);
  const booking =
    invoice.bookingId ||
    invoice.booking ||
    {};

  const guest =
    invoice.guestId ||
    invoice.guest ||
    booking.guestId ||
    {};

  const room =
    invoice.roomId ||
    invoice.room ||
    booking.roomId ||
    {};
console.log("InvoiceDetails invoice prop:", booking);
  const roomNumber =
    room.roomNumber ||
    booking?.roomId?.roomNumber ||
    "—";

  const bookingNo =
    booking.bookingNo ||
    invoice.bookingNo ||
    "—";

  const totalAmount =
    Number(
      invoice.totalAmount ||
        invoice.grandTotal ||
        invoice.amount ||
        0
    );

  const paidAmount =
    Number(
      invoice.paidAmount ||
        0
    );

  const dueAmount =
    Number(
      invoice.dueAmount ??
        totalAmount -
          paidAmount
    );

  const roomAmount =
    Number(
      invoice.roomAmount ||
        booking.roomAmount ||
        0
    );

  const discount =
    Number(
      invoice.discount ||
        booking.discount ||
        0
    );

  const taxAmount =
    Number(
      invoice.taxAmount ||
        booking.taxAmount ||
        0
    );

  const nights =
    Number(
      invoice.nights ||
        booking.nights ||
        1
    );

  const roomRate =
    Number(
      invoice.roomRate ||
        booking.roomRate ||
        0
    );

  // ==========================================================
  // FORMAT
  // ==========================================================

  const formatCurrency =
    (amount) =>
      new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }
      ).format(amount || 0);

  const formatDate =
    (date) => {
      if (!date) return "—";

      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    };

  // ==========================================================
  // PRINT
  // ==========================================================

  const handlePrint = () => {
    window.print();
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="invoice-details">

      {/* ====================================================
          INVOICE HEADER
      ==================================================== */}

      <div className="invoice-details-header">

        <div>

          <div className="invoice-brand">

            <div className="invoice-brand-icon">
              🏨
            </div>

            <div>
              <h2>
                Hotel PMS
              </h2>

              <span>
                Property Management System
              </span>
            </div>

          </div>

        </div>

        <div className="invoice-title">

          <span>
            INVOICE
          </span>

          <strong>
            {invoice.invoiceNo ||
              "—"}
          </strong>

        </div>

      </div>

      {/* ====================================================
          HOTEL / INVOICE INFORMATION
      ==================================================== */}

      <div className="invoice-meta">

        <div>

          <span>
            Invoice Date
          </span>

          <strong>
            {formatDate(
              invoice.createdAt ||
                invoice.invoiceDate
            )}
          </strong>

        </div>

        <div>

          <span>
            Booking No
          </span>

          <strong>
            {bookingNo}
          </strong>

        </div>

        <div>

          <span>
            Payment Status
          </span>

          <strong
            className={`invoice-detail-status ${
              invoice.status ||
              "unpaid"
            }`}
          >
            {invoice.status ||
              "unpaid"}
          </strong>

        </div>

      </div>

      {/* ====================================================
          GUEST / STAY
      ==================================================== */}

      <div className="invoice-info-grid">

        {/* GUEST */}

        <div className="invoice-info-card">

          <h4>
            Bill To
          </h4>

          <strong>
            {guest.name ||
              "—"}
          </strong>

          {guest.mobileNumber && (
            <span>
              {guest.mobileNumber}
            </span>
          )}

          {guest.email && (
            <span>
              {guest.email}
            </span>
          )}

        </div>

        {/* STAY */}

        <div className="invoice-info-card">

          <h4>
            Stay Details
          </h4>

          <div>
            <span>
              Room
            </span>

            <strong>
              {roomNumber !== "—"
                ? `Room ${roomNumber}`
                : "—"}
            </strong>
          </div>

          <div>
            <span>
              Check-in
            </span>

            <strong>
              {formatDate(
                invoice.checkInDate ||
                  booking.checkInDate
              )}
            </strong>
          </div>

          <div>
            <span>
              Check-out
            </span>

            <strong>
              {formatDate(
                invoice.checkOutDate ||
                  booking.checkOutDate
              )}
            </strong>
          </div>

        </div>

      </div>

      {/* ====================================================
          CHARGES TABLE
      ==================================================== */}

      <div className="invoice-charges">

        <h3>
          Charges
        </h3>

        <table>

          <thead>
            <tr>

              <th>
                Description
              </th>

              <th>
                Qty
              </th>

              <th>
                Rate
              </th>

              <th>
                Amount
              </th>

            </tr>
          </thead>

          <tbody>

            <tr>

              <td>
                Room accommodation
              </td>

              <td>
                {nights}
              </td>

              <td>
                {formatCurrency(
                  roomRate
                )}
              </td>

              <td>
                {formatCurrency(
                  roomAmount ||
                    nights *
                      roomRate
                )}
              </td>

            </tr>

            {discount > 0 && (
              <tr>

                <td>
                  Discount
                </td>

                <td>
                  —
                </td>

                <td>
                  —
                </td>

                <td className="discount-value">
                  -{" "}
                  {formatCurrency(
                    discount
                  )}
                </td>

              </tr>
            )}

            {taxAmount > 0 && (
              <tr>

                <td>
                  Tax
                </td>

                <td>
                  —
                </td>

                <td>
                  —
                </td>

                <td>
                  {formatCurrency(
                    taxAmount
                  )}
                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

      {/* ====================================================
          TOTALS
      ==================================================== */}

      <div className="invoice-total-section">

        <div className="invoice-total-row">

          <span>
            Subtotal
          </span>

          <strong>
            {formatCurrency(
              roomAmount
            )}
          </strong>

        </div>

        {discount > 0 && (
          <div className="invoice-total-row">

            <span>
              Discount
            </span>

            <strong className="discount-value">
              -{" "}
              {formatCurrency(
                discount
              )}
            </strong>

          </div>
        )}

        <div className="invoice-total-row">

          <span>
            Tax
          </span>

          <strong>
            {formatCurrency(
              taxAmount
            )}
          </strong>

        </div>

        <div className="invoice-total-row grand-total">

          <span>
            Grand Total
          </span>

          <strong>
            {formatCurrency(
              totalAmount
            )}
          </strong>

        </div>

        <div className="invoice-total-row paid-row">

          <span>
            Paid
          </span>

          <strong>
            {formatCurrency(
              paidAmount
            )}
          </strong>

        </div>

        <div className="invoice-total-row due-row">

          <span>
            Balance Due
          </span>

          <strong>
            {formatCurrency(
              dueAmount
            )}
          </strong>

        </div>

      </div>

      {/* ====================================================
          NOTES
      ==================================================== */}

      {invoice.notes && (
        <div className="invoice-notes">

          <h4>
            Notes
          </h4>

          <p>
            {invoice.notes}
          </p>

        </div>
      )}

      {/* ====================================================
          FOOTER ACTIONS
      ==================================================== */}

      <div className="invoice-detail-actions">

        <button
          type="button"
          className="secondary-button"
          onClick={onClose}
        >
          Close
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={
            handlePrint
          }
        >
          🖨 Print Invoice
        </button>

      </div>

    </div>
  );
};

export default InvoiceDetails;