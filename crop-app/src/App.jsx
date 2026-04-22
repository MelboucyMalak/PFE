import { Routes, Route, Navigate } from 'react-router'
import { AdminDashboard, CropsManagement, CropDetail, UsersManagement, UserHistory, UserDetail, RecommendationsManagement, RecommendationDetail, AdminProfile } from './pages/admin' 
import { FarmerDashboard, CropsConsulting, RecommendationsHistory, FarmerProfile } 
from './pages/farmer'
import  Login  from './pages/Authentification/Login/Login'
import Home from './pages/Home/Home'
import ForgotPassword from './pages/Authentification/ForgotPassword/ForgotPassword'
import NotFound from './pages/NotFound' 
import './App.css' 
import SignUp from './pages/Authentification/Sign-up/Sign-up'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />

        <Route path="/admin"> 
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="crops-management">
            <Route index element={<CropsManagement />} />
            <Route path=":cropId" element={<CropDetail />} />
          </Route>
          <Route path="users-management"> 
            <Route index element={<UsersManagement />} />
            <Route path=":userId-history" element={<UserHistory />} />
            <Route path=":userId" element={<UserDetail />} />
          </Route>
          <Route path="recommendations-management">
            <Route index element={<RecommendationsManagement />} />
            <Route path=":recommendationId" element={<RecommendationDetail />} />
          </Route>
          <Route path="profile" element={<AdminProfile />} /> 
        </Route>

        <Route path="/farmer"> 
          <Route path="dashboard" element={<FarmerDashboard />} />
          <Route path="crops-consulting">
            <Route index element={<CropsConsulting />} />
            <Route path=":cropId" element={<CropDetail />} />
          </Route>
          <Route path="recommendations-history" element={<RecommendationsHistory />} />
          <Route path="profile" element={<FarmerProfile />} />  
        </Route>
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </>
  )
}

export default App