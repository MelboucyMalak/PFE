import React from 'react';
import sowingIcon from '../icons/Sowing-month-icon.png';
import durationIcon from '../icons/Duration-icon.png';
import rightArrowIcon from '../icons/Right-arrow.png';
import './CropCard.css';

const PREBUILT_CROPS = new Set([
  'ash_gourd', 'beetroot', 'begalgram', 'bengalgram', 'bhendi', 'bitter_gourd', 'blackgram', 'bottle_gourd', 'brinjal',
  'cabbage', 'capsicum', 'carrot', 'castor', 'cauliflower', 'chayote', 'chilie', 'cluster_bean', 'cotton',
  'cowpea', 'cucumber', 'elephant_foot_yam', 'finger_millet', 'foxtail_millet', 'french_bean', 'groundnut',
  'horsegram', 'kodo_millet', 'maize', 'melon', 'moringa', 'mung_beans', 'onion', 'pearl_millet', 'peas',
  'pigeon_pea', 'proso_millet', 'pumpkin', 'radish', 'ribbed_gourd', 'rice', 'round_gourd', 'sesame',
  'small_onion', 'snake_gourd', 'sorghum', 'soyabean', 'sugarbeet', 'sugarcane', 'sunflower', 'sweet_potato',
  'tomato', 'watermelon', 'wheat'
]);

export const normalizeCropImagePath = (imagePath) => {
  if (!imagePath) return '/placeholder-crop.png';
  if (imagePath.startsWith('data:')) return imagePath;

  let decodedPath = imagePath;
  try {
    decodedPath = decodeURIComponent(imagePath);
  } catch (e) {
    console.error("URI decoding failed for path:", imagePath, e);
  }

  // Detect media path vs local path
  const mediaIndex = decodedPath.indexOf('/media/crops/');
  
  if (mediaIndex !== -1) {
    // It's a custom uploaded/edited image on the server, so we ALWAYS load from remote URL!
    return decodedPath.startsWith('http') ? decodedPath : `https://torbati.onrender.com${decodedPath}`;
  }

  // Strip query string for local file mapping
  const questionMarkIndex = decodedPath.indexOf('?');
  const pathWithoutQuery = questionMarkIndex !== -1 ? decodedPath.substring(0, questionMarkIndex) : decodedPath;

  let filenameWithExt = '';
  const cropsIndex = pathWithoutQuery.indexOf('/crops/');

  if (cropsIndex !== -1) {
    filenameWithExt = pathWithoutQuery.substring(cropsIndex + 7);
  } else if (pathWithoutQuery.includes('/')) {
    const segments = pathWithoutQuery.split('/');
    const lastSegment = segments[segments.length - 1];
    if (lastSegment && (lastSegment.toLowerCase().endsWith('.png') || lastSegment.toLowerCase().endsWith('.jpg') || lastSegment.toLowerCase().endsWith('.jpeg'))) {
      filenameWithExt = lastSegment;
    }
  } else {
    filenameWithExt = pathWithoutQuery;
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

  const lowerCapitalized = capitalized.toLowerCase();
  if (PREBUILT_CROPS.has(lowerCapitalized)) {
    return `/crops/${capitalized}${ext}`;
  }

  return decodedPath.startsWith('http') ? decodedPath : `https://torbati.onrender.com${decodedPath}`;
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
