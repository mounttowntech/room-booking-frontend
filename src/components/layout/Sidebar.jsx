import { NavLink } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import "./Sidebar.css";

import logo from "../../assets/roomlogo.png";
const SafeIcon = ({ name, size = 20, className = "" }) => {
  const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
  return <IconComponent size={size} className={className} />;
};

const Sidebar = () => {
  const navItems = [
    { path: "/dashboard", label: "Dashboard", iconName: "LayoutGrid" },
    { path: "/room-status", label: "Room Status", iconName: "BedDouble" },
    { path: "/bookings", label: "Bookings", iconName: "CalendarCheck" },
    { path: "/billing", label: "Billing", iconName: "Receipt" },
    { path: "/guests", label: "Guests", iconName: "Users" },
    { path: "/payments", label: "Payments", iconName: "Wallet" },
    { path: "/housekeeping", label: "Housekeeping", iconName: "Sparkles" },
    { path: "/reports", label: "Reports", iconName: "BarChart3" },
  ];

  return (
    <aside className="sidebar">
      {/* Header / Logo Section */}
      <div className="sidebar-header">
        <div className="logo-icon-wrapper">
          <img src={logo} alt="WonderBill Logo" className="sidebar-logo" />
        </div>
       
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <SafeIcon name={item.iconName} size={20} className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
