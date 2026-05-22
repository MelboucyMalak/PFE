// CropPopup.jsx
import React, { useState } from 'react';
import { normalizeCropImagePath } from './CropCard';
import leftArrow from '../icons/Left-arrow.png';
import rightArrow from '../icons/Right-arrow.png';
import './CropPopup.css';

// Premium high-fidelity icons from assets/images/cropsRelated
import calendarIcon from '../../../../assets/images/cropsRelated/calendar.png';
import durationIcon from '../../../../assets/images/cropsRelated/duration.png';
import rootsIcon from '../../../../assets/images/cropsRelated/roots.png';
import climateTempIcon from '../../../../assets/images/cropsRelated/climateTemp.png';
import climateRainIcon from '../../../../assets/images/cropsRelated/climateRain.png';
import climateHumidityIcon from '../../../../assets/images/cropsRelated/climateHumidity.png';
import soilPHIcon from '../../../../assets/images/cropsRelated/soilPH.png';
import soilDepthIcon from '../../../../assets/images/cropsRelated/soilDepth.png';
import soilShapeIcon from '../../../../assets/images/cropsRelated/soilShape.png';
import NIcon from '../../../../assets/images/cropsRelated/N.png';
import PIcon from '../../../../assets/images/cropsRelated/P.png';
import KIcon from '../../../../assets/images/cropsRelated/K.png';

const CLIMATE_NAME_MAP = {
  'BSh': 'Hot Semi-Arid',
  'BSk': 'Cold Semi-Arid',
  'Csa': 'Mediterranean (Hot Summer)',
  'BWh': 'Hot Desert',
  'bsh': 'Hot Semi-Arid',
  'bsk': 'Cold Semi-Arid',
  'csa': 'Mediterranean (Hot Summer)',
  'bwh': 'Hot Desert'
};

export function CropPopup({ crop, onClose }) {
  // Local state to track popup slide view window indices
  const [page, setPage] = useState(1);

  if (!crop) return null; // Logical layout fallback safety wall

  // Functions to increment or decrement page values while setting strict boundary loops
  const handleNextPage = () => { if (page < 4) setPage(page + 1); };
  const handlePrevPage = () => { if (page > 1) setPage(page - 1); };

  const imageUrl = normalizeCropImagePath(crop.image);

  return (
    <div className="popup-overlay-backdrop" onClick={onClose}>
      <div className="popup-window-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Fixed Header Inside Popup */}
        <header className="popup-view-header">
          <div className="popup-header-profile-block">
            <img src={imageUrl} alt="" className="popup-avatar-img" />
            <h3 className="popup-crop-main-title">{crop.crop_name}</h3>
          </div>
          <button className="popup-dismiss-btn" onClick={onClose}>&times;</button>
        </header>

        {/* POPUP SUB-PAGE ITERATOR SWITCHBOARD */}
        <div className="popup-scrollable-content">
          
          {/* PAGE 1: Generalities & Climate Parameters */}
          {page === 1 && (
            <div className="popup-slide-view slide-fade-in">
              <h4 className="slide-section-label label-generalities">Generalities</h4>
              <div className="data-panel panel-dark-green">
                <div className="panel-row">
                  <img src={calendarIcon} alt="" className="panel-row-icon" />
                  <p><strong>Sowing Month:</strong> <span>{crop.sowing_month_start} - {crop.sowing_month_end}</span></p>
                </div>
                <div className="panel-row">
                  <img src={durationIcon} alt="" className="panel-row-icon" />
                  <p><strong>Duration:</strong> <span>{crop.duration_days} days</span></p>
                </div>
                <div className="panel-row">
                  <img src={rootsIcon} alt="" className="panel-row-icon" />
                  <p><strong>Root depth:</strong> <span>{crop.root_depth_min_cm}cm - {crop.root_depth_max_cm}cm</span></p>
                </div>
              </div>
              
              <h4 className="slide-section-label label-climate">Climate</h4>
              <div className="data-panel panel-ocean-blue">
                <div className="panel-row">
                  <img src={climateTempIcon} alt="" className="panel-row-icon" />
                  <p><strong>Temperature range:</strong> <span>{crop.temp_min}°C - {crop.temp_max}°C</span></p>
                </div>
                <div className="panel-row">
                  <img src={climateRainIcon} alt="" className="panel-row-icon" />
                  <p><strong>Rainfall range:</strong> <span>{crop.water_min_mm}mm - {crop.water_max_mm}mm</span></p>
                </div>
                <div className="panel-row">
                  <img src={climateHumidityIcon} alt="" className="panel-row-icon" />
                  <p><strong>Humidity range:</strong> <span>{crop.humidity_min}% - {crop.humidity_max}%</span></p>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 2: Soil Proportions & NPK Chemicals */}
          {page === 2 && (
            <div className="popup-slide-view slide-fade-in">
              <h4 className="slide-section-label label-soil">Soil Related</h4>
              <div className="data-panel panel-earth-brown">
                <div className="panel-row">
                  <img src={soilPHIcon} alt="" className="panel-row-icon" />
                  <p><strong>PH-Range:</strong> <span>{crop.ph_min} - {crop.ph_max}</span></p>
                </div>
                <div className="panel-row">
                  <img src={soilDepthIcon} alt="" className="panel-row-icon" />
                  <p><strong>Sampling depth:</strong> <span>{crop.sampling_depth_cm} cm</span></p>
                </div>
                <div className="panel-row">
                  <img src={soilShapeIcon} alt="" className="panel-row-icon" />
                  <p><strong>Sampling shape:</strong> <span>{crop.sampling_shape}</span></p>
                </div>
              </div>
              
              <h4 className="slide-section-label label-npk">Required NPK</h4>
              <div className="data-panel panel-clean-white">
                <div className="panel-row">
                  <img src={NIcon} alt="N" className="npk-row-icon" />
                  <p><strong>Nitrogen:</strong> <span>{crop.n_kg_ha} kg/ha</span></p>
                </div>
                <div className="panel-row">
                  <img src={PIcon} alt="P" className="npk-row-icon" />
                  <p><strong>Phosphorus:</strong> <span>{crop.p_kg_ha} kg/ha</span></p>
                </div>
                <div className="panel-row">
                  <img src={KIcon} alt="K" className="npk-row-icon" />
                  <p><strong>Potassium:</strong> <span>{crop.k_kg_ha} kg/ha</span></p>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 3: Climate Zone Array Loop */}
          {page === 3 && (
            <div className="popup-slide-view slide-fade-in">
              <h4 className="slide-section-label label-climate-zone">Climate zone • rating</h4>
              <div className="dynamic-ratings-scroll-list">
                {crop.crop_climates?.map((item, index) => (
                  <div className="rating-card-row" key={index}>
                    <div className="climate-badge-zone">{CLIMATE_NAME_MAP[item.climate] || item.climate}</div>
                    <div className="rating-card-details">
                      <h5>Climate Rating: {item.rating}</h5>
                      <p>{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAGE 4: 12 Soil Texture Adaptability array loops mapped directly from backend objects */}
          {page === 4 && (
            <div className="popup-slide-view slide-fade-in">
              <h4 className="slide-section-label label-textures">Textures • rating</h4>
              <div className="dynamic-ratings-scroll-list">
                {crop.crop_soil_textures?.map((texture, index) => (
                  <div className="texture-card-row" key={index}>
                    <div className="texture-badge-label">{texture.texture_name}</div>
                    <div className="rating-card-details">
                      <h5>Texture Rating: {texture.suitability_rank}</h5>
                      <p>{texture.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sticky Interactive Footer Navigation Controls */}
        <footer className="popup-pagination-footer">
          <button 
            className={`pagination-arrow ${page === 1 ? 'arrow-inactive' : ''}`} 
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            <img src={leftArrow} alt="Previous" className="popup-arrow-icon" />
          </button>
          
          <span className="pagination-text-indicator">Page {page}/4</span>
          
          <button 
            className={`pagination-arrow ${page === 4 ? 'arrow-inactive' : ''}`} 
            onClick={handleNextPage}
            disabled={page === 4}
          >
            <img src={rightArrow} alt="Next" className="popup-arrow-icon" />
          </button>
        </footer>

      </div>
    </div>
  );
}
