// src/pages/invoices/InvoiceList.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  getAllInvoices,
  getInvoiceById,
  deleteInvoice,
} from "../../redux/slices/invoiceSlice";

import Modal from "../../components/common/Modal";

import InvoiceDetails from "./InvoiceDetails";

import toast from "react-hot-toast";

import "./invoices.css";

// ============================================================
// STATUS LABELS
// ============================================================

const invoiceStatusLabels = {
  paid: "Paid",
  partial: "Partial",
  unpaid: "Unpaid",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

// ============================================================
// COMPONENT
// ============================================================

const InvoiceList = () => {
  const dispatch = useDispatch();

  // ==========================================================
  // REDUX
  // ==========================================================

const {
  invoices = [],
  loading = false,
  error = null,
} = useSelector((state) => state.invoice);

console.log("Invoices:", invoices);
console.log("Loading:", loading);
console.log("Error:", error);



   const state = useSelector((state) => state);

   console.log("Redux state:", state);
  console.log("Redux state:", invoices, loading, error);

  // ==========================================================
  // LOCAL STATE
  // ==========================================================

  const [query, setQuery] = useState("");

  const [status, setStatus] =
    useState("all");

  const [
    selectedInvoice,
    setSelectedInvoice,
  ] = useState(null);

  const [
    showDetailsModal,
    setShowDetailsModal,
  ] = useState(false);

  const [
    openActionId,
    setOpenActionId,
  ] = useState(null);

  // ==========================================================
  // FETCH INVOICES
  // ==========================================================

  const fetchInvoices = async () => {
    try {
      await dispatch(
        getAllInvoices()
      ).unwrap();
    } catch (error) {
      console.error(
        "Failed to fetch all invoices:",
        error
      );

      toast.error(
        error ||
          "Failed to fetch all invoices"
      );
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // ==========================================================
  // SUMMARY
  // ==========================================================

  const summary = useMemo(() => {
    return {
      total: invoices?.length,

      paid: invoices?.filter(
        (invoice) =>
          invoice.paymentStatus ===
          "paid" ||
          invoice.status === "paid"
      ).length,

      partial: invoices?.filter(
        (invoice) =>
          invoice.paymentStatus ===
          "partial" ||
          invoice.status === "partial"
      ).length,

      unpaid: invoices?.filter(
        (invoice) =>
          invoice.paymentStatus ===
          "unpaid" ||
          invoice.status === "unpaid"
      ).length,
    };
  }, [invoices]);

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredInvoices = useMemo(() => {
    const search =
      query.trim().toLowerCase();

    return invoices.filter(
      (invoice) => {

   

        const bookingNo =
          invoice.bookingId
            ?.bookingNo ||
          invoice.booking?.bookingNo ||
          invoice.bookingNo ||
          "";

        const invoiceNo =
          invoice.invoiceNo || "";

        const guestName =
          invoice.guestId?.name ||
          invoice.guest?.name ||
          invoice.bookingId
            ?.guestId?.name ||
          "";

        const matchesSearch =
          !search ||
          invoiceNo
            .toLowerCase()
            .includes(search) ||
          bookingNo
            .toLowerCase()
            .includes(search) ||
          guestName
            .toLowerCase()
            .includes(search);

        const invoiceStatus =
          invoice.paymentStatus ||
          invoice.status ||
          "unpaid";

        const matchesStatus =
          status === "all" ||
          invoiceStatus === status;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    invoices,
    query,
    status,
  ]);

  // ==========================================================
  // VIEW INVOICE
  // ==========================================================

  const handleViewInvoice = async (
    invoice
  ) => {
    console.log("Viewing invoice:", invoice);
    setOpenActionId(null);

    try {
      const result =
        await dispatch(
          getInvoiceById(invoice._id)
        ).unwrap();

      const invoiceData =
        result?.data?.invoice ||
        result?.data ||
        result;

      setSelectedInvoice(
        invoice
      );

      setShowDetailsModal(true);
    } catch (error) {
      toast.error(
        error ||
          "Failed to load invoice"
      );
    }
  };

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedInvoice(null);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDeleteInvoice = async (
    invoice
  ) => {
    setOpenActionId(null);

    const confirmed =
      window.confirm(
        `Are you sure you want to delete invoice ${
          invoice.invoiceNo ||
          ""
        }?`
      );

    if (!confirmed) return;

    try {
      await dispatch(
        deleteInvoice(invoice._id)
      ).unwrap();

      toast.success(
        "Invoice deleted successfully"
      );

        fetchInvoices();
    } catch (error) {
      toast.error(
        error ||
          "Failed to delete invoice"
      );
    }
  };

  // ==========================================================
  // FORMAT CURRENCY
  // ==========================================================

  const formatCurrency = (
    amount
  ) => {
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
  // FORMAT DATE
  // ==========================================================

  const formatDate = (
    date
  ) => {
    if (!date) return "—";

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN"
    );
  };

  console.log(
    "Invoices:",
    invoices);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="invoice-list-page">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <header className="invoice-list-header">

        <div>
          <p className="eyebrow">
            Billing
          </p>

          <h1>
            Invoices
          </h1>

          <p className="subtitle">
            Manage booking invoices and
            payment balances
          </p>
        </div>

      </header>

      {/* ====================================================
          SUMMARY
      ==================================================== */}

      <section
        className="invoice-summary"
        aria-label="Invoice summary"
      >

        <button
          type="button"
          className={`summary-card ${
            status === "all"
              ? "selected"
              : ""
          }`}
          onClick={() =>
            setStatus("all")
          }
        >
          <div className="summary-card-top">
            <span className="summary-icon">
              ▣
            </span>

            <span>
              Total invoices
            </span>
          </div>

          <strong>
            {summary.total}
          </strong>
        </button>

        <button
          type="button"
          className={`summary-card ${
            status === "paid"
              ? "selected"
              : ""
          }`}
          onClick={() =>
            setStatus(
              status === "paid"
                ? "all"
                : "paid"
            )
          }
        >
          <div className="summary-card-top">
            <span className="status-dot paid" />

            <span>
              Paid
            </span>
          </div>

          <strong>
            {summary.paid}
          </strong>
        </button>

        <button
          type="button"
          className={`summary-card ${
            status === "partial"
              ? "selected"
              : ""
          }`}
          onClick={() =>
            setStatus(
              status === "partial"
                ? "all"
                : "partial"
            )
          }
        >
          <div className="summary-card-top">
            <span className="status-dot partial" />

            <span>
              Partial
            </span>
          </div>

          <strong>
            {summary.partial}
          </strong>
        </button>

        <button
          type="button"
          className={`summary-card ${
            status === "unpaid"
              ? "selected"
              : ""
          }`}
          onClick={() =>
            setStatus(
              status === "unpaid"
                ? "all"
                : "unpaid"
            )
          }
        >
          <div className="summary-card-top">
            <span className="status-dot unpaid" />

            <span>
              Unpaid
            </span>
          </div>

          <strong>
            {summary.unpaid}
          </strong>
        </button>

      </section>

      {/* ====================================================
          LIST PANEL
      ==================================================== */}

      <section className="invoice-list-panel">

        {/* TOOLBAR */}

        <div className="invoice-list-toolbar">

          <label className="search-box">

            <span className="search-icon">
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
              placeholder="Search invoice, booking or guest"
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
              onChange={(event) =>
                setStatus(
                  event.target.value
                )
              }
            >
              <option value="all">
                All statuses
              </option>

              <option value="paid">
                Paid
              </option>

              <option value="partial">
                Partial
              </option>

              <option value="unpaid">
                Unpaid
              </option>

              <option value="refunded">
                Refunded
              </option>
            </select>

            <button
              type="button"
              className="refresh-button"
              onClick={
                fetchInvoices
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

        <div className="invoice-table-wrap">

          <table className="invoice-table">

            <thead>
              <tr>

                <th>
                  Invoice
                </th>

                <th>
                  Booking
                </th>

                <th>
                  Guest
                </th>

                <th>
                  Date
                </th>

                <th>
                  Total
                </th>

                <th>
                  Paid
                </th>

                <th>
                  Due
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

              {loading ? (

                <tr>
                  <td
                    colSpan="9"
                    className="table-loading"
                  >
                    <div className="loading-spinner" />

                    Loading invoices...
                  </td>
                </tr>

              ) : filteredInvoices.length >
                0 ? (

                filteredInvoices.map(
                  (invoice) => {

                    const bookingNo =
                      invoice.bookingId
                        ?.bookingNo ||
                      invoice.booking
                        ?.bookingNo ||
                      invoice.bookingNo ||
                      "—";

                    const guestName =
                      invoice.guestId
                        ?.name ||
                      invoice.guest
                        ?.name ||
                      invoice.bookingId
                        ?.guestId
                        ?.name ||
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

                    const invoiceStatus =
                      invoice.paymentStatus ||
                      invoice.status ||
                      "unpaid";

                    return (
                      <tr
                        key={
                          invoice._id
                        }
                      >

                        {/* INVOICE */}

                        <td>
                          <div className="invoice-number-cell">

                            <div className="invoice-icon">
                              ₹
                            </div>

                            <div>
                              <strong>
                                {invoice.invoiceNo ||
                                  "—"}
                              </strong>

                              <span>
                                {invoice.invoiceType ||
                                  "Room Booking"}
                              </span>
                            </div>

                          </div>
                        </td>

                        {/* BOOKING */}

                        <td>
                          <span className="booking-number">
                            {bookingNo}
                          </span>
                        </td>

                        {/* GUEST */}

                        <td>
                          <span className="guest-name">
                            {guestName}
                          </span>
                        </td>

                        {/* DATE */}

                        <td>
                          {formatDate(
                            invoice.createdAt ||
                              invoice.invoiceDate
                          )}
                        </td>

                        {/* TOTAL */}

                        <td>
                          <strong>
                            {formatCurrency(
                              totalAmount
                            )}
                          </strong>
                        </td>

                        {/* PAID */}

                        <td>
                          <span className="paid-amount">
                            {formatCurrency(
                              paidAmount
                            )}
                          </span>
                        </td>

                        {/* DUE */}

                        <td>
                          <span
                            className={
                              dueAmount >
                              0
                                ? "due-amount"
                                : "paid-amount"
                            }
                          >
                            {formatCurrency(
                              dueAmount
                            )}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className={`invoice-status-badge ${invoiceStatus}`}
                          >
                            <span className="status-dot" />

                            {invoiceStatusLabels[
                              invoiceStatus
                            ] ||
                              invoiceStatus}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td className="actions-column">

                          <div className="invoice-actions">

                            <button
                              type="button"
                              className="more-button"
                              onClick={() =>
                                setOpenActionId(
                                  openActionId ===
                                    invoice._id
                                    ? null
                                    : invoice._id
                                )
                              }
                            >
                              ⋮
                            </button>

                            {openActionId ===
                              invoice._id && (

                              <div className="action-menu">

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleViewInvoice(
                                      invoice
                                    )
                                  }
                                >
                                  <span>
                                    ◉
                                  </span>

                                  View invoice
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenActionId(
                                      null
                                    );

                                    window.print();
                                  }}
                                >
                                  <span>
                                    🖨
                                  </span>

                                  Print invoice
                                </button>

                                <button
                                  type="button"
                                  className="danger-action"
                                  onClick={() =>
                                    handleDeleteInvoice(
                                      invoice
                                    )
                                  }
                                >
                                  <span>
                                    ⌫
                                  </span>

                                  Delete invoice
                                </button>

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
                    colSpan="9"
                    className="empty-state-cell"
                  >

                    <div className="empty-state">

                      <div className="empty-icon">
                        ▣
                      </div>

                      <h3>
                        No invoices found
                      </h3>

                      <p>
                        {query ||
                        status !==
                          "all"
                          ? "Try changing your search or filter."
                          : "Invoices will appear here when bookings are invoiced."}
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
          invoices.length > 0 && (

            <div className="invoice-list-footer">

              Showing{" "}
              <strong>
                {
                  filteredInvoices.length
                }
              </strong>{" "}
              of{" "}
              <strong>
                {invoices.length}
              </strong>{" "}
              invoices

            </div>
          )}

      </section>

      {/* ====================================================
          VIEW INVOICE MODAL
      ==================================================== */}

      <Modal
        isOpen={
          showDetailsModal
        }
        onClose={
          handleCloseModal
        }
        title="Invoice Details"
        width="900px"
      >

        {selectedInvoice && (
          <InvoiceDetails
            invoice={
              selectedInvoice
            }
            onClose={
              handleCloseModal
            }
          />
        )}

      </Modal>

    </main>
  );
};

export default InvoiceList;