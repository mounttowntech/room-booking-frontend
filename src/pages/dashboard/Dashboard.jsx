import React, { useState } from "react";
import "./Dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bed, IndianRupee, Calendar, Clock, Plus } from "lucide-react";
import { getDashboardData } from "../../redux/slices/dashboardSlice";

const Dashboard = () => {
  const { data } = useSelector((state) => state?.dashboard?.dashboardData || {});
  // const statedata = useSelector((state) => state);
  console.log("Dashboard state:", data);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [summary, setSummary] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);

  React.useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);

  React.useEffect(() => {
    if (data) {
      setSummary(data?.summary || null);
      setRecentBookings(data?.recentBookings || []);
      setOccupancyData(data?.occupancy || []);
    }
  }, [data]);

  const statsData = {
    totalRooms: 6,
    availableRooms: 3,
    todayRevenue: 5200,
    activeBookings: 3,
    pendingDue: 12680,
  };

  // const recentBookings = [
  //   {
  //     id: "BK-0001",
  //     guest: "Arun Kumar",
  //     room: "102",
  //     status: "Checked In",
  //     statusClass: "checked-in",
  //     amount: "₹5000",
  //   },
  //   {
  //     id: "BK-0002",
  //     guest: "Priya Sharma",
  //     room: "201",
  //     status: "Reserved",
  //     statusClass: "reserved",
  //     amount: "₹9000",
  //   },
  //   {
  //     id: "BK-0003",
  //     guest: "Nisha Rao",
  //     room: "301",
  //     status: "Pending",
  //     statusClass: "pending",
  //     amount: "₹1800",
  //   },
  // ];

  // const chartData = [
  //   { room: "101", height: "55%" },
  //   { room: "102", height: "35%" },
  //   { room: "201", height: "80%" },
  //   { room: "202", height: "45%" },
  //   { room: "301", height: "30%" },
  // ];

  console.log("occupancyData:", occupancyData);
  return (
    <div className="dashboard-page">
      <div className="dashboard-banner">
        <div className="dashboard-banner-content">
          <h1>Room Booking & Billing Dashboard</h1>
          <p>
            Static demo frontend connected to your backend workflow: booking,
            check-in, invoices, payments and reports.
          </p>
        </div>
        <button
          className="new-booking-btn"
          onClick={() => navigate("/bookings")}
        >
          <Plus size={18} />
          <span>New Booking</span>
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card" onClick={() => navigate("/rooms")}>
          <div className="stat-content">
            <span className="stat-title">Total Rooms</span>
            <h2 className="stat-value">{summary?.totalRooms || 0}</h2>
            <span className="stat-description">
              {summary?.availableRooms || 0} available now
            </span>
          </div>
          <div className="stat-icon-wrapper">
            <Bed size={20} />
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate("/reports")}>
          <div className="stat-content">
            <span className="stat-title">Today Revenue</span>
            <h2 className="stat-value highlight">
              ₹{summary?.todayRevenue?.toLocaleString() || 0}
            </h2>
            <span className="stat-description">Collected amount</span>
          </div>
          <div className="stat-icon-wrapper">
            <IndianRupee size={20} />
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate("/bookings")}>
          <div className="stat-content">
            <span className="stat-title">Active Bookings</span>
            <h2 className="stat-value highlight">{summary?.activeBookings || 0}</h2>
            <span className="stat-description">Reserved + checked-in</span>
          </div>
          <div className="stat-icon-wrapper">
            <Calendar size={20} />
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate("/payments")}>
          <div className="stat-content">
            <span className="stat-title">Pending Due</span>
            <h2 className="stat-value highlight">
              ₹{summary?.pendingDue?.toLocaleString() || 0}
            </h2>
            <span className="stat-description">Need collection</span>
          </div>
          <div className="stat-icon-wrapper">
            <Clock size={20} />
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        <div className="dashboard-panel bookings-panel">
          <div className="panel-header">
            <h3>Recent Bookings</h3>
          </div>

          <div className="booking-table-wrapper">
            <table className="dashbaord-booking-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* no data found */}
                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No recent bookings found.
                    </td>
                  </tr>
                )}
                {/* show only 5 recent bookings */}
                {recentBookings.slice(0, 5).map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="booking-id">{item.bookingNo}</td>
                    <td className="guest-name">{item.guestId?.name}</td>
                    <td>{item.roomId?.roomNumber}</td>
                    <td>
                      <span className={`status-badge ${item.statusClass}`}>
                        {item.bookingStatus}
                      </span>
                    </td>
                    <td className="booking-amount">$ {item.totalAmount?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-panel occupancy-panel">
          <div className="panel-header">
            <h3>Room Occupancy</h3>
            <span className="panel-subtext">Today</span>
          </div>

          <div className="occupancy-chart-container">
            <div className="chart-y-axis">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            <div className="chart-grid-lines">
              <div className="grid-line"></div>
              <div className="grid-line"></div>
              <div className="grid-line"></div>
              <div className="grid-line"></div>
              <div className="grid-line"></div>
            </div>

            <div className="chart-bars-wrapper">
              {occupancyData && occupancyData.map((item, index) => (
                <div className="bar-column" key={item.id || index}>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ height: `${item.occupancy || '0'}%` }}
                    ></div>
                  </div>
                  <span className="bar-label">{item.room}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
