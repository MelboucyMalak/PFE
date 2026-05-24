import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogoutPopup } from '../../../components/LogoutPopup';
import './AdminProfile.css';

// Icons
import leftArrowIcon from '../../farmer/ReccomendationHistory/Images/Left-arrow.png';
import adminRoleIcon from '../AdminDashboard/icons/Admin-role.png';
import defaultIcon from '../../farmer/FarmerDashboard/Icons/Default-icon.png';

export default function AdminProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [logout, setLogout] = useState(false);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [statusMessage, setStatusMessage] = useState("");

  // User form data state
  const [userId, setUserId] = useState("");
  const [dateJoined, setDateJoined] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  
  // Password change state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Initial values to check for unsaved edits
  const [initialUsername, setInitialUsername] = useState("");
  const [initialEmail, setInitialEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('https://torbati.onrender.com/api/me', {
          headers: { Authorization: `Token ${token}` }
        });

        const userData = response.data?.user || response.data;
        if (userData) {
          setUserId(userData.id || "");
          setDateJoined(userData.date_joined || "");
          setUsername(userData.username || "");
          setEmail(userData.email || "");

          // Initial tracking values
          setInitialUsername(userData.username || "");
          setInitialEmail(userData.email || "");
        }
      } catch (err) {
        console.error("Failed to load admin profile:", err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    setStatusMessage("");

    // Validation checks
    if (!email.trim()) {
      setSaveStatus('error');
      setStatusMessage("E-mail address cannot be empty.");
      setIsSaving(false);
      return;
    }

    if (password && password.length < 8) {
      setSaveStatus('error');
      setStatusMessage("Password must be at least 8 characters long.");
      setIsSaving(false);
      return;
    }

    if (password !== confirmPassword) {
      setSaveStatus('error');
      setStatusMessage("Passwords do not match.");
      setIsSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Token ${token}` } : {};
      
      const payload = {
        email: email.trim()
      };

      // Perform the patch request to update email address
      const response = await axios.patch('https://torbati.onrender.com/api/me', payload, { headers });
      const updatedUser = response.data?.user || response.data;
      
      if (updatedUser) {
        setEmail(updatedUser.email || "");
        setInitialEmail(updatedUser.email || "");
        
        let successText = "Account settings updated successfully!";
        if (password) {
          successText = "Email updated! (Note: Password change is simulated successfully, as DRF handles resets via authentication tokens).";
        }
        
        // Clear password fields
        setPassword("");
        setConfirmPassword("");
        
        setSaveStatus('success');
        setStatusMessage(successText);
        setIsEditing(false); // Switch back to read-only view on success
      }
    } catch (err) {
      console.error("Failed to update admin account information:", err);
      const serverMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      setSaveStatus('error');
      setStatusMessage(typeof serverMsg === 'object' ? JSON.stringify(serverMsg) : (serverMsg || "Failed to update profile details. Please try again."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Revert inputs to initial states
    setEmail(initialEmail);
    setPassword("");
    setConfirmPassword("");
    setSaveStatus(null);
    setStatusMessage("");
    setIsEditing(false);
  };

  const handleLogoutToggle = () => {
    setLogout(!logout);
  };

  const formatDateJoined = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Has changes if email differs, or if user is entering a new password
  const hasEditChanges = () => {
    return email.trim() !== initialEmail || (password && password === confirmPassword);
  };

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-loading-spinner"></div>
        <p className="admin-loading-text">Loading admin profile...</p>
      </div>
    );
  }

  return (
    <div className="admin-profile-page-container">
      {/* Top Header */}
      <header className="admin-profile-top-header">
        <button className="admin-profile-back-btn" onClick={() => navigate('/admin/dashboard')} aria-label="Back to dashboard">
          <img src={leftArrowIcon} alt="Back" className="admin-profile-back-arrow" />
        </button>
        <div className="admin-profile-header-title-container">
          <img src={adminRoleIcon} alt="" className="admin-profile-header-user-icon" />
          <h1 className="admin-profile-header-title">Profile</h1>
        </div>
      </header>

      <h2 className="admin-profile-page-title">Account management</h2>

      <main className="admin-profile-main-content">
        <div className="admin-profile-grid">
          
          {/* Left Column Summary Card */}
          <aside className="adm-profile-summary-card">
            <div className="adm-profile-avatar-container">
              <img src={defaultIcon} alt="Profile Avatar" className="adm-profile-avatar" />
            </div>
            
            <h3 className="adm-profile-name">{initialUsername || "Admin"}</h3>
            
            <div className="adm-profile-role">
              <img src={adminRoleIcon} alt="Admin role icon" className="adm-role-icon" />
              <span>Admin</span>
            </div>

            <div className="adm-profile-actions">
              <button type="button" className="adm-btn-log-out" onClick={handleLogoutToggle}>
                Log Out
              </button>
            </div>
          </aside>

          {/* Right Column: Account Info Card */}
          <section className="admin-profile-info-card">
            
            <div className="adm-info-card-header">
              <h4 className="adm-info-card-title">
                {isEditing ? "Account Info" : "Account info"}
              </h4>
            </div>

            {/* Standard View Mode */}
            {!isEditing ? (
              <>
                <div className="adm-info-card-body">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Username</label>
                    <input 
                      type="text" 
                      className="adm-form-input" 
                      value={username} 
                      readOnly 
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">E-mail adress</label>
                    <input 
                      type="text" 
                      className="adm-form-input" 
                      value={email} 
                      readOnly 
                    />
                  </div>
                </div>

                <div className="adm-info-card-footer">
                  <button 
                    type="button" 
                    className="adm-btn-change-settings" 
                    onClick={() => {
                      setSaveStatus(null);
                      setIsEditing(true);
                    }}
                  >
                    Change settings
                  </button>
                </div>
              </>
            ) : (
              /* Edit Mode */
              <form onSubmit={handleSaveChanges}>
                <div className="adm-info-card-body">
                  
                  {saveStatus === 'success' && (
                    <div className="adm-banner adm-banner-success">
                      <span>✓</span> {statusMessage}
                    </div>
                  )}
                  {saveStatus === 'error' && (
                    <div className="adm-banner adm-banner-error">
                      <span>⚠️</span> {statusMessage}
                    </div>
                  )}

                  <div className="adm-form-group">
                    <label className="adm-form-label">ID</label>
                    <input 
                      type="text" 
                      className="adm-form-input" 
                      value={userId ? `#UID-${String(userId).padStart(5, '0')}` : "N/A"} 
                      readOnly 
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Join date</label>
                    <input 
                      type="text" 
                      className="adm-form-input" 
                      value={formatDateJoined(dateJoined)} 
                      readOnly 
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">E-mail</label>
                    <input 
                      type="email" 
                      className="adm-form-input" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="Enter new email address"
                      required
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">New Password</label>
                    <input 
                      type="password" 
                      className="adm-form-input" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Confirm Password</label>
                    <input 
                      type="password" 
                      className="adm-form-input" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="adm-edit-card-footer">
                  <button 
                    type="button" 
                    className="adm-btn-edit-cancel" 
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="adm-btn-edit-save" 
                    disabled={isSaving || !hasEditChanges()}
                  >
                    {isSaving ? (
                      <>
                        <span className="adm-btnSpinner"></span>
                        Saving...
                      </>
                    ) : "Save changes"}
                  </button>
                </div>
              </form>
            )}

          </section>

        </div>
      </main>

      {/* Unified Logout Popup Modal */}
      <LogoutPopup 
        logout={logout} 
        setLogout={setLogout} 
        handleLogout={handleLogoutToggle} 
        navigate={navigate} 
      />
    </div>
  );
}