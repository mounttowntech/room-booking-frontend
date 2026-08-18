import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector(
    (state) => state.auth
  );

  return (
    <div>
      <h1>Dashboard</h1>

      <p>
        Welcome, {user?.name || "Admin"}
      </p>

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <h3>Total Rooms</h3>
          <h2>0</h2>
        </div>

        <div className="dashboard-card">
          <h3>Available Rooms</h3>
          <h2>0</h2>
        </div>

        <div className="dashboard-card">
          <h3>Today's Bookings</h3>
          <h2>0</h2>
        </div>

        <div className="dashboard-card">
          <h3>Today's Revenue</h3>
          <h2>₹0</h2>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;