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

  const navItems = [
    { path: "/dashboard", label: "Dashboard", iconName: "LayoutGrid" , roles: ["admin", "manager", "receptionist", "housekeeping"],},
    { path: "/rooms", label: "Room", iconName: "BedDouble", roles: ["admin", "manager", "receptionist"] },
    { path: "/bookings", label: "Bookings", iconName: "CalendarCheck", roles: ["admin", "manager", "receptionist"], },
    // { path: "/billing", label: "Billing", iconName: "Receipt" },
    { path: "/guests", label: "Guests", iconName: "Users",  roles: ["admin", "manager", "receptionist"] },
    { path: "/payments", label: "Payments", iconName: "Wallet", roles: ["admin", "manager", "receptionist"] },
    { path: "/invoices", label: "Invoices", iconName: "Receipt", roles: ["admin", "manager", "receptionist"] },
    { path: "/housekeeping", label: "Housekeeping", iconName: "Sparkles", roles: ["admin", "manager", "housekeeping"] },
    { path: "/reports", label: "Reports", iconName: "BarChart3", roles: ["admin", "manager"] },
  ];

  const visibleNavItems = navItems.filter((item) =>
  item.roles.includes(userRole)
);

  return (
    <aside className="sidebar">
      {/* Header / Logo Section */}
      <div className="sidebar-header">
        <div className="logo-icon-wrapper">
          <img src={logo} alt="WonderBill Logo" className="sidebar-logo" />
        </div>
       
      </div>

      {/* Navigation Links */}
      {/* <nav className="sidebar-nav">
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
      </nav> */}
      {/* Navigation Links */}
<nav className="sidebar-nav">
  {visibleNavItems.map((item) => (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) =>
        `nav-item ${isActive ? "active" : ""}`
      }
    >
      <SafeIcon
        name={item.iconName}
        size={20}
        className="nav-icon"
      />

      <span className="nav-label">
        {item.label}
      </span>
    </NavLink>
  ))}
</nav>
    </aside>
  );
};

export default Sidebar;
