import React from 'react';
import axios from 'axios';
import logoutImage from '../pages/farmer/FarmerDashboard/Icons/Logout-image.png';
import './LogoutPopup.css';

export function LogoutPopup({ logout, setLogout, handleLogout, navigate }) {
  if (!logout) return null;

  const handleConfirmLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const headers = { Authorization: `Token ${token}` };
        // Post request is standard for DRF token logout
        await axios.post("https://torbati.onrender.com/api/logout", {}, { headers });
      }
    } catch (e) {
      console.warn("POST logout failed, trying GET fallback:", e);
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const headers = { Authorization: `Token ${token}` };
          await axios.get("https://torbati.onrender.com/api/logout", { headers });
        }
      } catch (err) {
        console.warn("GET logout fallback also failed:", err);
      }
    } finally {
      // Unconditionally remove token locally and redirect
      localStorage.removeItem("token");
      navigate('/login');
    }
  };

  return (
    <div className="logout-overlay" onClick={handleLogout}>
      <div className="logout-modal-card" onClick={(e) => e.stopPropagation()}>

        <div className="logout-modal-pattern"></div>


        <img src={logoutImage} alt="Logout Illustration" className="logout-modal-image" />


        <p className="logout-modal-message">Are you sure you wish to log out?</p>


        <div className="logout-modal-buttons">
          <button className="logout-btn-confirm" onClick={handleConfirmLogout}>
            Log Out
          </button>
          <button className="logout-btn-cancel" onClick={handleLogout}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}