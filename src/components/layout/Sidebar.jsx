import { useState } from "react";
import { NavLink } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import "./Sidebar.css";

import logo from "../../assets/roomlogo.png";
import { useSelector } from "react-redux";

const SafeIcon = ({ name, size = 20, className = "" }) => {
  const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
  return <IconComponent size={size} className={className} />;
};

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role?.toLowerCase();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      iconName: "LayoutGrid",
      roles: ["admin", "manager", "receptionist", "housekeeping"],
    },
    {
      path: "/rooms",
      label: "Room",
      iconName: "BedDouble",
      roles: ["admin", "manager", "receptionist"],
    },
    {
      path: "/bookings",
      label: "Bookings",
      iconName: "CalendarCheck",
      roles: ["admin", "manager", "receptionist"],
    },
    {
      path: "/guests",
      label: "Guests",
      iconName: "Users",
      roles: ["admin", "manager", "receptionist"],
    },
    {
      path: "/payments",
      label: "Payments",
      iconName: "Wallet",
      roles: ["admin", "manager", "receptionist"],
    },
    {
      path: "/invoices",
      label: "Invoices",
      iconName: "Receipt",
      roles: ["admin", "manager", "receptionist"],
    },
    {
      path: "/housekeeping",
      label: "Housekeeping",
      iconName: "Sparkles",
      roles: ["admin", "manager", "housekeeping"],
    },
    {
      path: "/reports",
      label: "Reports",
      iconName: "BarChart3",
      roles: ["admin", "manager"],
    },
  ];

  const visibleNavItems = navItems.filter((item) =>
    item.roles.includes(userRole),
  );

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger button - only shows on mobile when sidebar is CLOSED */}
      {!isOpen && (
        <button
          className="sidebar-hamburger"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <LucideIcons.Menu size={24} />
        </button>
      )}

      {/* Overlay - click to close on mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Header / Logo Section */}
        <div className="sidebar-header">
          <div className="logo-icon-wrapper">
            <img src={logo} alt="WonderBill Logo" className="sidebar-logo" />
          </div>

          {/* Close button - only shows on mobile, inside open sidebar */}
          <button
            className="sidebar-close"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <LucideIcons.X size={22} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <SafeIcon name={item.iconName} size={20} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
