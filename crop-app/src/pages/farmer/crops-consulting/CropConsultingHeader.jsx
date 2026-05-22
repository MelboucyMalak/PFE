import React from 'react';
import { useNavigate } from 'react-router-dom';
import cropListIcon from '../FarmerDashboard/Icons/Crop-list.png';
import backArrow from './icons/Left-arrow.png';
import backArrowHover from './icons/Left-arrow-hover.png';
import './CropConsultingHeader.css';

export default function CropConsultingHeader() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/farmer/dashboard');
  };

  return (
    <header className="crop-consulting-header">

      <div className="header-title-container">
        <img src={cropListIcon} alt="" className="header-icon" />
        <h1 className="header-title">Crop List</h1>
      </div>
      <button className="btn-back" onClick={handleBack} aria-label="Go Back">
        <img src={backArrow} alt="Back" className="back-arrow-icon default-arrow" />
        <img src={backArrowHover} alt="Back" className="back-arrow-icon hover-arrow" />
      </button>
    </header>
  );
}


