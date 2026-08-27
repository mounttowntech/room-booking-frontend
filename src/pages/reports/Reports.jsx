import React, {
  useEffect,
  useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  getBookingReport,
  getRevenueReport,
} from "../../redux/slices/reportSlice";

import "./reports.css";

const Reports = () => {
  const dispatch = useDispatch();

  // ============================================================
  // REDUX
  // ============================================================

  const {
    bookingReports,
    revenueReports,
    loading,
    error,
  } = useSelector(
    (state) => state.reports
  );

  // ============================================================
  // STATE
  // ============================================================

  const [reportType, setReportType] =
    useState("bookings");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  // ============================================================
  // DEFAULT DATES
  // ============================================================

  useEffect(() => {
    const today = new Date();

    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const formatDate = (date) => {
      return date
        .toISOString()
        .split("T")[0];
    };

    setFromDate(
      formatDate(firstDay)
    );

    setToDate(
      formatDate(today)
    );
  }, []);

  // ============================================================
  // LOAD REPORT
  // ============================================================

  const loadReport = () => {
    if (!fromDate || !toDate) {
      return;
    }

    const params = {
      startDate: fromDate,
      endDate: toDate,
    };

    if (reportType === "bookings") {
      dispatch(
        getBookingReport(params)
      );
    }

    if (reportType === "revenue") {
      dispatch(
        getRevenueReport(params)
      );
    }
  };

  // ============================================================
  // INITIAL REPORT
  // ============================================================

  useEffect(() => {
    if (!fromDate || !toDate) {
      return;
    }

    loadReport();
  }, [
    reportType,
    fromDate,
    toDate,
  ]);

  // ============================================================
  // FORMAT CURRENCY
  // ============================================================

  const formatCurrency = (value) => {
    return `₹${Number(
      value || 0
    ).toLocaleString("en-IN")}`;
  };

  // ============================================================
  // FORMAT STATUS
  // ============================================================

  const formatStatus = (status) => {
    if (!status) {
      return "-";
    }

    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="reports-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="reports-header">

        <div>
          <h1>Reports</h1>

          <p>
            View and analyze hotel operations
          </p>
        </div>

      </div>

      {/* ======================================================
          REPORT TABS
      ====================================================== */}

      <div className="report-tabs">

        <button
          type="button"
          className={
            reportType === "bookings"
              ? "report-tab active"
              : "report-tab"
          }
          onClick={() =>
            setReportType("bookings")
          }
        >
          Bookings
        </button>

        <button
          type="button"
          className={
            reportType === "revenue"
              ? "report-tab active"
              : "report-tab"
          }
          onClick={() =>
            setReportType("revenue")
          }
        >
          Revenue
        </button>

      </div>

      {/* ======================================================
          DATE FILTER
      ====================================================== */}

      <div className="report-filter">

        <div className="filter-field">

          <label>
            From
          </label>

          <input
            type="date"
            value={fromDate}
            onChange={(e) =>
              setFromDate(
                e.target.value
              )
            }
          />

        </div>

        <div className="filter-field">

          <label>
            To
          </label>

          <input
            type="date"
            value={toDate}
            onChange={(e) =>
              setToDate(
                e.target.value
              )
            }
          />

        </div>

        <button
          type="button"
          className="generate-btn"
          onClick={loadReport}
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : "Generate Report"}
        </button>

      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="report-error">
          {error}
        </div>
      )}

      {/* ======================================================
          BOOKING REPORT
      ====================================================== */}

      {reportType === "bookings" && (
        <>

          {/* SUMMARY */}

          <div className="report-summary">

            <div className="summary-card">

              <span>
                Total Bookings
              </span>

              <strong>
                {
                  bookingReports
                    ?.totalBookings ?? 0
                }
              </strong>

            </div>

            <div className="summary-card">

              <span>
                Total Booking Amount
              </span>

              <strong>
                {formatCurrency(
                  bookingReports
                    ?.totalAmount
                )}
              </strong>

            </div>

          </div>

          {/* STATUS REPORT */}

          <div className="report-content">

            <div className="report-section-header">

              <div>
                <h2>
                  Booking Status
                </h2>

                <p>
                  Booking count and amount by status
                </p>
              </div>

            </div>

            <div className="report-table-wrapper">

              <table className="report-table">

                <thead>

                  <tr>
                    <th>Status</th>
                    <th>Bookings</th>
                    <th>Amount</th>
                  </tr>

                </thead>

                <tbody>

                  {!bookingReports
                    ?.bookingsByStatus
                    ?.length ? (

                    <tr>
                      <td
                        colSpan="3"
                        className="no-data"
                      >
                        No booking data found
                      </td>
                    </tr>

                  ) : (

                    bookingReports.bookingsByStatus.map(
                      (item) => (

                        <tr
                          key={item._id}
                        >

                          <td>

                            <span
                              className={`status-badge ${item._id}`}
                            >
                              {formatStatus(
                                item._id
                              )}
                            </span>

                          </td>

                          <td>
                            {item.count}
                          </td>

                          <td>
                            {formatCurrency(
                              item.amount
                            )}
                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </>
      )}

      {/* ======================================================
          REVENUE REPORT
      ====================================================== */}

      {reportType === "revenue" && (
        <>

          {/* SUMMARY */}

          <div className="report-summary">

            <div className="summary-card">

              <span>
                Total Revenue
              </span>

              <strong>
                {formatCurrency(
                  revenueReports
                    ?.totalRevenue
                )}
              </strong>

            </div>

            <div className="summary-card">

              <span>
                Total Payments
              </span>

              <strong>
                {
                  revenueReports
                    ?.totalPayments ?? 0
                }
              </strong>

            </div>

          </div>

          {/* PAYMENT METHOD REPORT */}

          <div className="report-content">

            <div className="report-section-header">

              <div>
                <h2>
                  Payment Methods
                </h2>

                <p>
                  Revenue collected by payment method
                </p>
              </div>

            </div>

            <div className="report-table-wrapper">

              <table className="report-table">

                <thead>

                  <tr>
                    <th>
                      Payment Method
                    </th>

                    <th>
                      Payments
                    </th>

                    <th>
                      Amount
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {!revenueReports
                    ?.paymentMethods
                    ?.length ? (

                    <tr>
                      <td
                        colSpan="3"
                        className="no-data"
                      >
                        No payment data found
                      </td>
                    </tr>

                  ) : (

                    revenueReports.paymentMethods.map(
                      (item) => (

                        <tr
                          key={item._id}
                        >

                          <td>
                            {formatStatus(
                              item._id
                            )}
                          </td>

                          <td>
                            {item.count}
                          </td>

                          <td>
                            {formatCurrency(
                              item.total
                            )}
                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </>
      )}

    </div>
  );
};

export default Reports;