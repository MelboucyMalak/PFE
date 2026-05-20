import React from 'react';
import './DashboardHeader.css';
import homeIcon from './Icons/Home-icon.png';

export function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <img src={homeIcon} alt="Home" className="home-icon" />
        <h1>Home</h1>
      </div>
    </header>
  );
}