import React from 'react';
import logoutImage from '../pages/farmer/FarmerDashboard/Icons/Logout-image.png';
import './LogoutPopup.css';

export function LogoutPopup({ logout, setLogout, handleLogout, navigate }) {
  if (!logout) return null;

  return (
    <div className="logout-overlay" onClick={handleLogout}>
      <div className="logout-modal-card" onClick={(e) => e.stopPropagation()}>

        <div className="logout-modal-pattern"></div>


        <img src={logoutImage} alt="Logout Illustration" className="logout-modal-image" />


        <p className="logout-modal-message">Are you sure you wish to log out?</p>


        <div className="logout-modal-buttons">
          <button className="logout-btn-confirm" onClick={() => navigate('/login')}>
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