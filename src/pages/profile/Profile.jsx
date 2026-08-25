import React, { useState, useRef } from "react";
import {
  Camera,
  User,
  Mail,
  Phone,
  Shield,
  Briefcase,
  Edit3,
  CheckCircle,
  XCircle,
  FileImage,
} from "lucide-react";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: "Manoj Kumar",
    username: "manojkumarbr",
    email: "manojkumarbr@example.com",
    phone: "+91 98765 43210",
    role: "Admin",
    department: "Hotel Operations",
  });

  const [avatarSrc, setAvatarSrc] = useState("https://via.placeholder.com/100");
  const [fileDetails, setFileDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarSrc(imageUrl);
      setFileDetails({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
      });
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Add save logic or API integration here
  };

  return (
    <div className="profile-container">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* Header / Cover Banner */}
      <div className="profile-banner">
        <div className="profile-header-content">
          <div className="pcard-avatar-wrapper">
            <img
              src={avatarSrc}
              alt="Profile Avatar"
              className="pcard-avatar-img"
            />
            <button
              className="pcard-avatar-btn"
              title="Upload New Avatar"
              type="button"
              onClick={handleAvatarClick}
            >
              <Camera size={14} />
            </button>
          </div>
          <div className="profile-title">
            <h2>{profile.fullName}</h2>
            <span className="role-badge">
              <Shield size={12} /> {profile.role}
            </span>

            {/* Display Uploaded File Info */}
            {/* {fileDetails && (
              // <div className="avatar-file-info">
              //   <FileImage size={13} />
              //   <span>
              //     Source: {fileDetails.name} ({fileDetails.size})
              //   </span>
              // </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="profile-card">
        <div className="card-header">
          <h3>Personal Details</h3>
          {!isEditing && (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              <Edit3 size={15} /> Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Username</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-with-icon">
                <Phone size={16} className="input-icon" />
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Role</label>
              <div className="input-with-icon">
                <Shield size={16} className="input-icon" />
                <input
                  type="text"
                  name="role"
                  value={profile.role}
                  disabled
                  className="input-disabled"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Department</label>
              <div className="input-with-icon">
                <Briefcase size={16} className="input-icon" />
                <input
                  type="text"
                  name="department"
                  value={profile.department}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsEditing(false)}
              >
                <XCircle size={16} /> Cancel
              </button>
              <button type="submit" className="btn-save">
                <CheckCircle size={16} /> Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
