import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from './DashboardHeader';
import { LogoutPopup } from '../../../components/LogoutPopup';
import axios from 'axios';
import './FarmerDashboard.css';

// Icons
import cropListIcon from './Icons/Crop-list.png';
import cropListHoverIcon from './Icons/Crop-list-hover.png';
import historyIcon from './Icons/History.png';
import historyHoverIcon from './Icons/History-hover.png';
import generateReccIcon from './Icons/Generate-recc.png';
import generateReccHoverIcon from './Icons/Generate-recc-hover.png';
import userRoleIcon from './Icons/User-role-cion.png';
import defaultIcon from './Icons/Default-icon.png';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [logout, setLogout] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    setLogout(!logout);
  }

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
        console.error("Failed to fetch user data:", error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    }

    getUserData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-loading-spinner"></div>
        <p className="dashboard-loading-text">Loading your dashboard...</p>
      </div>
    );
  }


  return (
    <div className="farmer-dashboard-container">
      <DashboardHeader />

      <main className="dashboard-main-content">
        <div className="dashboard-grid">


          <aside className="profile-card">
            <img src={defaultIcon} alt="Profile Avatar" className="profile-avatar" />

            <h2 className="profile-name">{userData?.username || userData?.user?.username || "Farmer"}</h2>

            <div className="profile-role">
              <img src={userRoleIcon} alt="User role" className="role-icon" />
              <span>Regular user</span>
            </div>

            <div className="profile-actions">
              <button className="btn-manage-profile" onClick={() => navigate('/farmer/profile')}>
                Manage profile
              </button>
              <button className="btn-log-out" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </aside>


          <section className="action-cards">
            <button className="action-card" onClick={() => navigate('/farmer/crops-consulting')}>
              <img src={cropListIcon} alt="Crop List" className="action-icon normal-icon" />
              <img src={cropListHoverIcon} alt="Crop List Hover" className="action-icon hover-icon" />
              <span className="action-title">Crop List</span>
            </button>

            <button className="action-card" onClick={() => navigate('/farmer/recommendations-history')}>
              <img src={historyIcon} alt="History" className="action-icon normal-icon" />
              <img src={historyHoverIcon} alt="History Hover" className="action-icon hover-icon" />
              <span className="action-title">History</span>
            </button>

            <button className="action-card" onClick={() => navigate('/farmer/map')}>
              <img src={generateReccIcon} alt="Generate Recommendation" className="action-icon normal-icon" />
              <img src={generateReccHoverIcon} alt="Generate Recommendation Hover" className="action-icon hover-icon" />
              <span className="action-title">Generate Recommendation</span>
            </button>
          </section>

        </div>
      </main>
      <LogoutPopup logout={logout} setLogout={setLogout} handleLogout={handleLogout} navigate={navigate} />
    </div>
  );
}