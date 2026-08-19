import "./Dashboard.css";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector(
    (state) => state.auth
  );

  return (
    <div className="dashboard-page">

      {/* =====================================================
      DASHBOARD HEADER
  ===================================================== */}

      <div className="dashboard-banner">

        <div className="dashboard-banner-content">

          <h1>
            Room Booking & Billing Dashboard
          </h1>

          <p>
            Welcome back, {user?.name || "Admin"}. Manage bookings,
            check-ins, billing, payments and reports.
          </p>

        </div>

        <button
          className="new-booking-btn"
          onClick={() => {
            // navigate("/bookings/new");
          }}
        >
          <span>+</span>
          New Booking
        </button>

      </div>


      {/* =====================================================
      SUMMARY CARDS
  ===================================================== */}

      <div className="dashboard-stats">

        {/* TOTAL ROOMS */}

        <div className="stat-card">

          <div className="stat-content">

            <span className="stat-title">
              Total Rooms
            </span>

            <h2>
              0
            </h2>

            <span className="stat-description">
              All registered rooms
            </span>

          </div>

          <div className="stat-icon">
            🏨
          </div>

        </div>


        {/* AVAILABLE ROOMS */}

        <div className="stat-card">

          <div className="stat-content">

            <span className="stat-title">
              Available Rooms
            </span>

            <h2>
              0
            </h2>

            <span className="stat-description">
              Ready for booking
            </span>

          </div>

          <div className="stat-icon">
            🛏️
          </div>

        </div>


        {/* TODAY'S BOOKINGS */}

        <div className="stat-card">

          <div className="stat-content">

            <span className="stat-title">
              Today's Bookings
            </span>

            <h2>
              0
            </h2>

            <span className="stat-description">
              Today's reservations
            </span>

          </div>

          <div className="stat-icon">
            📅
          </div>

        </div>


        {/* TODAY'S REVENUE */}

        <div className="stat-card">

          <div className="stat-content">

            <span className="stat-title">
              Today's Revenue
            </span>

            <h2>
              ₹0
            </h2>

            <span className="stat-description">
              Collected amount
            </span>

          </div>

          <div className="stat-icon">
            ₹
          </div>

        </div>

      </div>


      {/* =====================================================
      DASHBOARD CONTENT
  ===================================================== */}

      <div className="dashboard-content">


        {/* ===================================================
        RECENT BOOKINGS
    =================================================== */}

        <div className="dashboard-panel bookings-panel">

          <div className="panel-header">

            <div>
              <h3>
                Recent Bookings
              </h3>

              <p>
                Latest room reservations
              </p>
            </div>

            <button
              className="view-all-btn"
              onClick={() => {
                // navigate("/bookings");
              }}
            >
              View All
            </button>

          </div>


          <div className="booking-table-wrapper">

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
                    Status
                  </th>

                  <th>
                    Amount
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td>
                    BK-0001
                  </td>

                  <td>
                    Arun Kumar
                  </td>

                  <td>
                    102
                  </td>

                  <td>
                    <span className="status-badge checked-in">
                      Checked In
                    </span>
                  </td>

                  <td>
                    ₹5,000
                  </td>

                </tr>


                <tr>

                  <td>
                    BK-0002
                  </td>

                  <td>
                    Priya Sharma
                  </td>

                  <td>
                    201
                  </td>

                  <td>
                    <span className="status-badge reserved">
                      Reserved
                    </span>
                  </td>

                  <td>
                    ₹9,000
                  </td>

                </tr>


                <tr>

                  <td>
                    BK-0003
                  </td>

                  <td>
                    Nisha Rao
                  </td>

                  <td>
                    301
                  </td>

                  <td>
                    <span className="status-badge pending">
                      Pending
                    </span>
                  </td>

                  <td>
                    ₹1,800
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>


        {/* ===================================================
        ROOM OCCUPANCY
    =================================================== */}

        <div className="dashboard-panel occupancy-panel">

          <div className="panel-header">

            <div>

              <h3>
                Room Occupancy
              </h3>

              <p>
                Current room status
              </p>

            </div>

          </div>


          <div className="occupancy-content">

            <div className="occupancy-chart">

              <div
                className="occupancy-bar"
                style={{ height: "65%" }}
              >
                <span>
                  65%
                </span>
              </div>

              <div
                className="occupancy-bar"
                style={{ height: "38%" }}
              >
                <span>
                  38%
                </span>
              </div>

              <div
                className="occupancy-bar"
                style={{ height: "80%" }}
              >
                <span>
                  80%
                </span>
              </div>

              <div
                className="occupancy-bar"
                style={{ height: "55%" }}
              >
                <span>
                  55%
                </span>
              </div>

              <div
                className="occupancy-bar"
                style={{ height: "30%" }}
              >
                <span>
                  30%
                </span>
              </div>

            </div>


            <div className="occupancy-labels">

              <span>
                Mon
              </span>

              <span>
                Tue
              </span>

              <span>
                Wed
              </span>

              <span>
                Thu
              </span>

              <span>
                Fri
              </span>

            </div>

          </div>


          {/* OCCUPANCY SUMMARY */}

          <div className="occupancy-summary">

            <div>
              <span className="summary-dot occupied"></span>

              <span>
                Occupied
              </span>

              <strong>
                0
              </strong>
            </div>


            <div>
              <span className="summary-dot available"></span>

              <span>
                Available
              </span>

              <strong>
                0
              </strong>
            </div>


            <div>
              <span className="summary-dot maintenance"></span>

              <span>
                Maintenance
              </span>

              <strong>
                0
              </strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;