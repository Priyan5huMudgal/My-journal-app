import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const InfoPage = () => {
  const { user, logout, updateProfile, changePassword } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    dob: "",
    gender: "",
    profession: "",
    hobbies: "",
    bio: "",
    profileImage: ""
  });
  
  const [passData, setPassData] = useState({ currentPassword: "", newPassword: "" });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        dob: user.dob || "",
        gender: user.gender || "",
        profession: user.profession || "",
        hobbies: user.hobbies || "",
        bio: user.bio || "",
        profileImage: user.profileImage || ""
      });
    }
  }, [user]);

  if (!user) {
    return <div className="info-shell">Loading...</div>;
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== "profileImage") {
          submitData.append(key, formData[key] || "");
        }
      });
      if (profileImageFile) {
        submitData.append("profileImage", profileImageFile);
      }

      await updateProfile(submitData);
      setIsEditing(false);
      setProfileImageFile(null);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to update profile.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      await changePassword(passData);
      setShowPasswordModal(false);
      setPassData({ currentPassword: "", newPassword: "" });
      setMessage("Password changed successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePassChange = (e) => setPassData({ ...passData, [e.target.name]: e.target.value });

  const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : "U";

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `http://localhost:5000${url}`;
  };

  return (
    <main className="info-shell">
      <section className="info-card">
        
        {message && <div style={{ color: "#4caf50", textAlign: "center", marginBottom: "16px", fontFamily: "Cinzel, serif" }}>{message}</div>}
        {error && <div style={{ color: "#f44336", textAlign: "center", marginBottom: "16px", fontFamily: "Cinzel, serif" }}>{error}</div>}

        <div className="profile-header">
          {user.profileImage ? (
            <img src={getImageUrl(user.profileImage)} alt="Profile" className="profile-avatar" style={{ objectFit: "cover" }} />
          ) : (
            <div className="profile-avatar">{initial}</div>
          )}
          <h2 className="profile-name">{user.fullName}</h2>
          <p className="profile-username">@{user.username}</p>
        </div>

        {!isEditing && !showPasswordModal && (
          <>
            <div className="profile-grid">
              <div className="profile-section-card">
                <h3>Personal Information</h3>
                
                <div className="profile-field">
                  <span className="profile-field-label">Email</span>
                  <span className="profile-field-value">{user.email}</span>
                </div>
                
                <div className="profile-field">
                  <span className="profile-field-label">Phone Number</span>
                  <span className="profile-field-value">{user.phone || "Not provided"}</span>
                </div>
                
                <div className="profile-field">
                  <span className="profile-field-label">Date of Birth</span>
                  <span className="profile-field-value">{user.dob || "Not provided"}</span>
                </div>
                
                <div className="profile-field">
                  <span className="profile-field-label">Gender</span>
                  <span className="profile-field-value">{user.gender || "Not provided"}</span>
                </div>
              </div>

              <div className="profile-section-card">
                <h3>Background</h3>
                
                <div className="profile-field">
                  <span className="profile-field-label">Profession</span>
                  <span className="profile-field-value">{user.profession || "Not provided"}</span>
                </div>
                
                <div className="profile-field">
                  <span className="profile-field-label">Hobbies</span>
                  <span className="profile-field-value">{user.hobbies || "Not provided"}</span>
                </div>
                
                <div className="profile-field">
                  <span className="profile-field-label">Bio</span>
                  <span className="profile-field-value">{user.bio || "Not provided"}</span>
                </div>
              </div>
            </div>

            <div className="info-actions" style={{ marginTop: "36px", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
              <button className="ink-button small" onClick={() => setIsEditing(true)}>Edit Profile</button>
              <button className="ink-button small" onClick={() => setShowPasswordModal(true)}>Change Password</button>
              <Link to="/journal" className="ink-button small">Back to Journal</Link>
              <button className="ink-button small" onClick={logout}>Sign Out</button>
            </div>
          </>
        )}

        {isEditing && (
          <form onSubmit={handleProfileSubmit} className="profile-edit-form" style={{ display: 'grid', gap: '16px', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
            <h3 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--vintage-brown)', borderBottom: '1px solid rgba(74, 52, 34, 0.1)', paddingBottom: '8px' }}>Edit Profile</h3>
            
            <div className="form-group">
              <label>Full Name</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Profile Picture</label>
              <input type="file" name="profileImage" accept="image/*" onChange={(e) => setProfileImageFile(e.target.files[0])} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Phone Number</label>
                <input name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input name="dob" type="date" value={formData.dob} onChange={handleChange} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Gender</label>
                <input name="gender" value={formData.gender} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Profession</label>
                <input name="profession" value={formData.profession} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Hobbies</label>
              <input name="hobbies" value={formData.hobbies} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} style={{ height: '80px', width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(74, 52, 34, 0.2)', background: 'rgba(252, 246, 235, 0.6)' }}></textarea>
            </div>

            <div className="info-actions" style={{ marginTop: "24px", justifyContent: "center" }}>
              <button type="submit" className="ink-button small">Save Changes</button>
              <button type="button" className="ink-button small" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        )}

        {showPasswordModal && (
          <form onSubmit={handlePasswordSubmit} className="profile-edit-form" style={{ display: 'grid', gap: '16px', maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
            <h3 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--vintage-brown)', borderBottom: '1px solid rgba(74, 52, 34, 0.1)', paddingBottom: '8px' }}>Change Password</h3>
            
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" name="currentPassword" value={passData.currentPassword} onChange={handlePassChange} required />
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <input type="password" name="newPassword" value={passData.newPassword} onChange={handlePassChange} required minLength="8" />
            </div>

            <div className="info-actions" style={{ marginTop: "24px", justifyContent: "center" }}>
              <button type="submit" className="ink-button small">Update Password</button>
              <button type="button" className="ink-button small" onClick={() => setShowPasswordModal(false)}>Cancel</button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
};

export default InfoPage;
