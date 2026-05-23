import React from 'react';
import logoutImage from '../pages/farmer/FarmerDashboard/Icons/Logout-image.png';
import './ExitMapPopup.css';

export function ExitMapPopup({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="exit-map-overlay" onClick={onClose}>
      <div className="exit-map-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="exit-map-modal-pattern"></div>
        <img src={logoutImage} alt="Exit Map Illustration" className="exit-map-modal-image" />
        <p className="exit-map-modal-message">Are you sure you want to exit the map?</p>
        <div className="exit-map-modal-buttons">
          <button className="exit-map-btn-confirm" onClick={onConfirm}>
            Back to dashboard
          </button>
          <button className="exit-map-btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
