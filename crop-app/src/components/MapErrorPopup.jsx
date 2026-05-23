import React from 'react';
import './MapErrorPopup.css';

export function MapErrorPopup({ isOpen, errorType, onClose }) {
  if (!isOpen) return null;

  const isOutsideAlgeria = errorType === 'OUTSIDE_ALGERIA';
  const isNotSuitable = errorType === 'NOT_SUITABLE_LAND';
  const isCustomError = typeof errorType === 'object' && errorType !== null;

  // Choose title and text based on backend custom error type
  const title = isOutsideAlgeria
    ? 'Location Outside Algeria'
    : isNotSuitable
    ? 'Non-Arable Soil Detected'
    : isCustomError
    ? (errorType.title || 'Validation Warning')
    : 'Validation Warning';

  const message = isOutsideAlgeria
    ? 'The coordinates you clicked are outside the borders of Algeria. Our recommendation engine is calibrated specifically for Algerian agricultural soil. Please drag the marker or select a coordinate inside Algeria.'
    : isNotSuitable
    ? 'The selected coordinates are identified as non-arable or unsuitable land (such as desert sands, rocky cliffs, urban settlements, or water bodies). Please pinpoint a fertile agricultural parcel.'
    : isCustomError
    ? (errorType.message || 'We encountered a validation error for the selected coordinate. Please click on a different agricultural parcel on the map.')
    : 'We encountered a validation error for the selected coordinate. Please click on a different agricultural parcel on the map.';

  return (
    <div className="map-error-overlay" onClick={onClose}>
      <div className="map-error-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="map-error-modal-pattern"></div>
        
        {/* Render premium SVG illustrations natively to guarantee flawless rendering without assets loading delays */}
        <div className="map-error-modal-icon-container">
          {isOutsideAlgeria ? (
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="50" fill="#E8F5E9" />
              <path d="M60 25C43.5 25 30 38.5 30 55C30 75 60 95 60 95C60 95 90 75 90 55C90 38.5 76.5 25 60 25ZM60 67C53.4 67 48 61.6 48 55C48 48.4 53.4 43 60 43C66.6 43 72 48.4 72 55C72 61.6 66.6 67 60 67Z" fill="#D32F2F" />
              <path d="M40 55H80" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              <path d="M60 35V75" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              <circle cx="60" cy="55" r="7" fill="#FFFFFF" />
            </svg>
          ) : (
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="50" fill="#FFF3E0" />
              <path d="M60 28L88 77H32L60 28Z" fill="#F57C00" stroke="#E65100" strokeWidth="2" strokeLinejoin="round" />
              <rect x="57" y="47" width="6" height="15" rx="3" fill="#FFFFFF" />
              <circle cx="60" cy="68" r="3.5" fill="#FFFFFF" />
              <path d="M42 85H78" stroke="#E65100" strokeWidth="4" strokeLinecap="round" />
            </svg>
          )}
        </div>

        <h3 className="map-error-modal-title">{title}</h3>
        <p className="map-error-modal-message">{message}</p>
        
        <div className="map-error-modal-buttons">
          <button className="map-error-btn-confirm" onClick={onClose}>
            Choose Another Location
          </button>
        </div>
      </div>
    </div>
  );
}
