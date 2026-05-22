import React from 'react';
import sowingIcon from '../icons/Sowing-month-icon.png';
import durationIcon from '../icons/Duration-icon.png';
import rightArrowIcon from '../icons/Right-arrow.png';
import './CropCard.css';

export const normalizeCropImagePath = (imagePath) => {
  if (!imagePath) return '/placeholder-crop.png';

  let decodedPath = imagePath;
  try {
    decodedPath = decodeURIComponent(imagePath);
  } catch (e) {
    console.error("URI decoding failed for path:", imagePath, e);
  }

  let filenameWithExt = '';
  const cropsIndex = decodedPath.indexOf('/crops/');
  const mediaIndex = decodedPath.indexOf('/media/crops/');

  if (cropsIndex !== -1) {
    filenameWithExt = decodedPath.substring(cropsIndex + 7);
  } else if (mediaIndex !== -1) {
    filenameWithExt = decodedPath.substring(mediaIndex + 13);
  } else if (decodedPath.includes('/')) {
    const segments = decodedPath.split('/');
    const lastSegment = segments[segments.length - 1];
    if (lastSegment && (lastSegment.toLowerCase().endsWith('.png') || lastSegment.toLowerCase().endsWith('.jpg') || lastSegment.toLowerCase().endsWith('.jpeg'))) {
      filenameWithExt = lastSegment;
    }
  } else {
    filenameWithExt = decodedPath;
  }

  if (!filenameWithExt) {
    return decodedPath.startsWith('http') ? decodedPath : `https://torbati.onrender.com${decodedPath}`;
  }

  const dotIndex = filenameWithExt.lastIndexOf('.');
  if (dotIndex === -1) return decodedPath;

  const nameWithoutExt = filenameWithExt.substring(0, dotIndex);
  const ext = '.png';

  const lowerName = nameWithoutExt.toLowerCase().trim();
  if (lowerName === 'chow chow' || lowerName === 'chow-chow' || lowerName === 'chowchow') {
    return '/crops/Chayote.png';
  }
  if (lowerName === 'chili' || lowerName === 'chilli' || lowerName === 'chillies') {
    return '/crops/Chilie.png';
  }

  const formattedName = nameWithoutExt.trim().replace(/[-\s]+/g, '_');
  const parts = formattedName.split('_');
  const capitalized = parts.map((word, index) => {
    if (index === 0) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    } else {
      return word.toLowerCase();
    }
  }).join('_');

  return `/crops/${capitalized}${ext}`;
};

export function CropCard({ crop, onViewClick }) {
  const sowingTimeline = crop.sowing_month_start && crop.sowing_month_end
    ? `${crop.sowing_month_start} - ${crop.sowing_month_end}`
    : 'Not Specified';

  const imageUrl = normalizeCropImagePath(crop.image);

  return (
    <div className="crop-display-card">
      <div className="crop-card-img-wrapper">
        <img 
          src={imageUrl} 
          alt={crop.crop_name} 
          className="crop-card-img" 
        />
      </div>
      
      <h3 className="crop-card-title">{crop.crop_name}</h3>
      
      <div className="crop-card-specs-list">
        <div className="crop-spec-item">
          <img src={sowingIcon} alt="" className="crop-spec-icon" />
          <p><span>Sowing Month:</span> {sowingTimeline}</p>
        </div>
        <div className="crop-spec-item">
          <img src={durationIcon} alt="" className="crop-spec-icon" />
          <p><span>Duration:</span> {crop.duration_days} days</p>
        </div>
      </div>
      
      <button className="crop-card-btn-view" onClick={onViewClick}>
        View Crop <img src={rightArrowIcon} alt="" className="view-crop-arrow-icon" />
      </button>
    </div>
  );
}
