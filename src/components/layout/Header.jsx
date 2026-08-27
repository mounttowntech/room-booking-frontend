import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  LogOut,
  User,
  Lock,
  ChevronDown,
  Calendar,
  CreditCard,
  UserCheck,
  CheckCheck,
  X,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle,
} from "lucide-react";
import { logout, changePassword } from "../../redux/slices/authSlice";
import "./Header.css";
import profileImageAvatar from "../../assets/images/profile-image-avatar.jpg";
import toast from "react-hot-toast";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Change Password Modal & Form States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Sample Notifications Data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Booking Received",
      desc: "John Doe booked Room 302 for 3 nights.",
      time: "5 mins ago",
      read: false,
      icon: <Calendar size={16} className="notif-type-icon booking" />,
    },
    {
      id: 2,
      title: "Invoice Paid",
      desc: "Invoice #INV-2045 has been settled.",
      time: "1 hour ago",
      read: false,
      icon: <CreditCard size={16} className="notif-type-icon invoice" />,
    },
    {
      id: 3,
      title: "Guest Checked In",
      desc: "Sarah Smith checked into Room 104.",
      time: "3 hours ago",
      read: true,
      icon: <UserCheck size={16} className="notif-type-icon guest" />,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  // Handle Change Password Form Input
  const handlePasswordInputChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordError("");
  };

  // Close & Reset Modal State
  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  // Submit Change Password
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("All fields are required.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    // Add API dispatch call here for changing password
    const result = dispatch(changePassword(passwordData));
    console.log("Change Password Result:", result);
    if (changePassword.fulfilled.match(result)) {
        toast.success("Password changed successfully!");
    }

    if (changePassword.rejected.match(result)) {
        toast.error(result.payload || "Password change failed. Please try again.");
    }

    closePasswordModal();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="app-header">
        <div className="header-search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search booking, room, guest, invoice..."
            className="header-search-input"
          />
        </div>

        {/* Right Section: Actions & User Profile */}
        <div className="header-right-section">
          {/* Notification Bell & Dropdown */}
          <div className="notification-container" ref={notificationRef}>
            <button
              className={`notification-btn ${isNotificationsOpen ? "active" : ""}`}
              aria-label="Notifications"
              onClick={() => {
                setIsNotificationsOpen((prev) => !prev);
                setIsProfileOpen(false);
              }}
            >
              <Bell size={20} className="bell-icon" />
              {unreadCount > 0 && <span className="notification-badge"></span>}
            </button>

            {isNotificationsOpen && (
              <div className="notification-dropdown-menu">
                <div className="notification-header">
                  <div className="notification-title-group">
                    <h3>Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="unread-count-badge">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button className="mark-all-btn" onClick={markAllAsRead}>
                      <CheckCheck size={14} />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`notification-item ${
                          item.read ? "read" : "unread"
                        }`}
                        onClick={() => markAsRead(item.id)}
                      >
                        <div className="notif-icon-wrapper">{item.icon}</div>
                        <div className="notif-content">
                          <span className="notif-title">{item.title}</span>
                          <p className="notif-desc">{item.desc}</p>
                          <span className="notif-time">{item.time}</span>
                        </div>
                        {!item.read && <span className="unread-dot"></span>}
                      </div>
                    ))
                  ) : (
                    <div className="no-notifications">
                      <p>No notifications available</p>
                    </div>
                  )}
                </div>

                <div className="notification-footer">
                  <button
                    className="view-all-btn"
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      navigate("/notifications");
                    }}
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Vertical Divider */}
          <div className="header-divider"></div>

          {/* User Profile Dropdown */}
          <div className="user-profile-container" ref={profileRef}>
            <div
              className="user-profile"
              onClick={() => {
                setIsProfileOpen((prev) => !prev);
                setIsNotificationsOpen(false);
              }}
            >
              <div className="user-info">
                <span className="user-name">{user?.name || "Admin User"}</span>
                <span className="user-role">
                  {user?.role || "System Manager"}
                </span>
              </div>

              <div className="avatar-wrapper">
                <img
                  src={
                    user?.avatar ||
                    profileImageAvatar
                  }
                  alt="User Avatar"
                  className="user-avatar"
                />
              </div>
              <ChevronDown
                size={16}
                className={`dropdown-arrow ${isProfileOpen ? "open" : ""}`}
              />
            </div>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="profile-dropdown-menu">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/profile");
                  }}
                >
                  <User size={16} />
                  <span>My Profile</span>
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsPasswordModalOpen(true);
                  }}
                >
                  <Lock size={16} />
                  <span>Change Password</span>
                </button>

                <div className="dropdown-divider"></div>

                <button
                  className="dropdown-item logout-item"
                  onClick={() => {
                    setIsProfileOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Blurred Backdrop & Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="pwd-modal-overlay">
          <div className="pwd-modal-container">
            <div className="pwd-modal-header">
              <div className="pwd-title-group">
                <div className="pwd-icon-badge">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3>Change Password</h3>
                  <p>Update your account security password</p>
                </div>
              </div>
              <button
                className="pwd-close-btn"
                onClick={closePasswordModal}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="pwd-modal-form">
              {passwordError && (
                <div className="pwd-error-alert">{passwordError}</div>
              )}

              {/* Old Password */}
              <div className="pwd-form-group">
                <label>Old Password</label>
                <div className="pwd-input-wrapper">
                  <Lock size={16} className="pwd-input-icon" />
                  <input
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    placeholder="Enter current password"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordInputChange}
                  />
                  <button
                    type="button"
                    className="pwd-toggle-btn"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="pwd-form-group">
                <label>New Password</label>
                <div className="pwd-input-wrapper">
                  <Lock size={16} className="pwd-input-icon" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                  />
                  <button
                    type="button"
                    className="pwd-toggle-btn"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="pwd-form-group">
                <label>Confirm New Password</label>
                <div className="pwd-input-wrapper">
                  <Lock size={16} className="pwd-input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                  />
                  <button
                    type="button"
                    className="pwd-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pwd-modal-actions">
                <button
                  type="button"
                  className="pwd-btn-cancel"
                  onClick={closePasswordModal}
                >
                  Cancel
                </button>
                <button type="submit" className="pwd-btn-submit">
                  <CheckCircle size={16} />
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
