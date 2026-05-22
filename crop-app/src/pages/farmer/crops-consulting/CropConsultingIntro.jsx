import React from 'react';
import { useNavigate } from 'react-router-dom';
import cropListImage from './icons/Crop-list-image.png';
import CropConsultingHeader from './CropConsultingHeader';
import './CropConsultingIntro.css';

export default function CropConsultingIntro() {
  const navigate = useNavigate();

  const handleBegin = () => {
    navigate('/farmer/crops-consulting/list');
  };

  return (
    <div className="crop-consulting-page">
      <CropConsultingHeader />

      <div className="crop-consulting-intro-container">
        <div className="crop-consulting-intro-card">
          <img src={cropListImage} alt="Welcome Illustration" className="intro-image" />
          <h1 className="intro-title">Welcome to our Crop List!</h1>
          <p className="intro-description">
            This is Where you will be able to view the different crops currently available in our Data base.
          </p>
          <button className="btn-begin" onClick={handleBegin}>
            Begin
          </button>
        </div>
      </div>
    </div>
  );
}
