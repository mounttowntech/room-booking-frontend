import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        Hotel PMS
      </div>

      <nav>

        <NavLink to="/dashboard">
          Dashboard
        </NavLink>

        <div className="menu-title">
          FRONT DESK
        </div>

        <NavLink to="/bookings">
          Bookings
        </NavLink>

        <NavLink to="/guests">
          Guests
        </NavLink>

        <div className="menu-title">
          ROOMS
        </div>

        <NavLink to="/rooms">
          Rooms
        </NavLink>

        <div className="menu-title">
          OPERATIONS
        </div>

        <NavLink to="/housekeeping">
          Housekeeping
        </NavLink>

        <div className="menu-title">
          FINANCE
        </div>

        <NavLink to="/invoices">
          Invoices
        </NavLink>

        <NavLink to="/payments">
          Payments
        </NavLink>

        <div className="menu-title">
          REPORTS
        </div>

        <NavLink to="/reports">
          Reports
        </NavLink>

        <div className="menu-title">
          SETTINGS
        </div>

        <NavLink to="/settings">
          Settings
        </NavLink>

      </nav>

    </aside>
  );
};

export default Sidebar;