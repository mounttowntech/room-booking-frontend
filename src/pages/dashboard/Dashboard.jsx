import React from "react";
import "./Dashboard.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bed, IndianRupee, Calendar, Clock, Plus } from "lucide-react";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const statsData = {
    totalRooms: 6,
    availableRooms: 3,
    todayRevenue: 5200,
    activeBookings: 3,
    pendingDue: 12680,
  };

  const recentBookings = [
    {
      id: "BK-0001",
      guest: "Arun Kumar",
      room: "102",
      status: "Checked In",
      statusClass: "checked-in",
      amount: "₹5000",
    },
    {
      id: "BK-0002",
      guest: "Priya Sharma",
      room: "201",
      status: "Reserved",
      statusClass: "reserved",
      amount: "₹9000",
    },
    {
      id: "BK-0003",
      guest: "Nisha Rao",
      room: "301",
      status: "Pending",
      statusClass: "pending",
      amount: "₹1800",
    },
  ];

  const chartData = [
    { room: "101", height: "55%" },
    { room: "102", height: "35%" },
    { room: "201", height: "80%" },
    { room: "202", height: "45%" },
    { room: "301", height: "30%" },
  ];

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
          onClick={() => navigate("/bookings/new")}
        >
          <Plus size={18} />
          <span>New Booking</span>
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Total Rooms</span>
            <h2 className="stat-value">{statsData.totalRooms}</h2>
            <span className="stat-description">
              {statsData.availableRooms} available now
            </span>
          </div>
          <div className="stat-icon-wrapper">
            <Bed size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Today Revenue</span>
            <h2 className="stat-value highlight">
              ₹{statsData.todayRevenue.toLocaleString()}
            </h2>
            <span className="stat-description">Collected amount</span>
          </div>
          <div className="stat-icon-wrapper">
            <IndianRupee size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Active Bookings</span>
            <h2 className="stat-value highlight">{statsData.activeBookings}</h2>
            <span className="stat-description">Reserved + checked-in</span>
          </div>
          <div className="stat-icon-wrapper">
            <Calendar size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Pending Due</span>
            <h2 className="stat-value highlight">
              ₹{statsData.pendingDue.toLocaleString()}
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
            <table className="booking-table">
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
                {recentBookings.map((item) => (
                  <tr key={item.id}>
                    <td className="booking-id">{item.id}</td>
                    <td className="guest-name">{item.guest}</td>
                    <td>{item.room}</td>
                    <td>
                      <span className={`status-badge ${item.statusClass}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="booking-amount">{item.amount}</td>
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
              {chartData.map((item, index) => (
                <div className="bar-column" key={index}>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ height: item.height }}
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
