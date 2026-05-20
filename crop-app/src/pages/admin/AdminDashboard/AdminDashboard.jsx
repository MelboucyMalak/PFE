import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoutPopup } from '../../../components/LogoutPopup';
import axios from 'axios';
import './AdminDashboard.css';


import cropIcon from './icons/Crop.png';
import cropHoverIcon from './icons/Crop-hover.png';
import userIcon from './icons/User.png';
import userHoverIcon from './icons/User-hover.png';
import historyIcon from './icons/History.png';
import historyHoverIcon from './icons/History-hover.png';
import adminRoleIcon from './icons/Admin-role.png';


import defaultIcon from '../../farmer/FarmerDashboard/Icons/Default-icon.png';
import homeIcon from '../../farmer/FarmerDashboard/Icons/Home-icon.png';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [logout, setLogout] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    setLogout(!logout);
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('https://torbati.onrender.com/api/me', {
          headers: {
            Authorization: `Token ${token}`
          }
        });

        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch admin user data:", error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-loading-spinner"></div>
        <p className="admin-loading-text">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-header-content">
          <img src={homeIcon} alt="Home" className="admin-home-icon" />
          <h1>Home</h1>
        </div>
      </header>

      <main className="admin-main-content">
        <div className="admin-grid">

          <aside className="admin-profile-card">
            <img src={defaultIcon} alt="Admin Avatar" className="admin-profile-avatar" />

            <h2 className="admin-profile-name">
              {userData?.username || userData?.user?.username || "Admin"}
            </h2>

            <div className="admin-profile-role">
              <img src={adminRoleIcon} alt="Admin role" className="admin-role-icon" />
              <span>Admin</span>
            </div>

            <div className="admin-profile-actions">
              <button className="admin-btn-manage" onClick={() => navigate('/admin/profile')}>
                Manage profile
              </button>
              <button className="admin-btn-logout" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </aside>

          <section className="admin-action-cards">
            <button className="admin-action-card" onClick={() => navigate('/admin/crops-management')}>
              <img src={cropIcon} alt="Manage Crops" className="admin-action-icon admin-normal-icon" />
              <img src={cropHoverIcon} alt="Manage Crops Hover" className="admin-action-icon admin-hover-icon" />
              <span className="admin-action-title">Manage Crops</span>
            </button>

            <button className="admin-action-card" onClick={() => navigate('/admin/users-management')}>
              <img src={userIcon} alt="Manage Users" className="admin-action-icon admin-normal-icon" />
              <img src={userHoverIcon} alt="Manage Users Hover" className="admin-action-icon admin-hover-icon" />
              <span className="admin-action-title">Manage Users</span>
            </button>

            <button className="admin-action-card" onClick={() => navigate('/admin/recommendations-management')}>
              <img src={historyIcon} alt="Manage Recommendation History" className="admin-action-icon admin-normal-icon" />
              <img src={historyHoverIcon} alt="Manage Recommendation History Hover" className="admin-action-icon admin-hover-icon" />
              <span className="admin-action-title">Manage Recommendation History</span>
            </button>
          </section>

        </div>
      </main>

      <LogoutPopup logout={logout} setLogout={setLogout} handleLogout={handleLogout} navigate={navigate} />
    </div>
  );
}