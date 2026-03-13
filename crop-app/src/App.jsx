
import './App.css'

function App() {

  return (
    <>
      <Routes> 
        <Route path="/admin">
          <Route index element={<Navigate to="/admin/login" />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/crops-management">
            <Route index element={<CropsManagement />} />
            <Route path=":cropId" element={<CropDetail />} />
          </Route>

          <Route path="/users-management"> 
            <Route index element={<UsersManagement />} />
            <Route path=":userId-history" element={<UserHistory />} />
            <Route path=":userId" element={<UserDetail />} />
          </Route>
          
          <Route path="/recommendations-management">
            <Route index element={<RecommendationsManagement />} />
            <Route path=":recommendationId" element={<RecommendationDetail />} />
          </Route>

          <Route path="/profile" element={<AdminProfile />} />
          <Route path="/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/reset-password" element={<AdminResetPassword />} /> 
          <Route path="/login" element={<AdminLogin />} />
        </Route>

        <Route path="/farmer">
          <Route index element={<Navigate to="/farmer/login" />} />
          <Route path="/dashboard" element={<FarmerDashboard />} />
          <Route path="/crops-consulting">
              <Route index element={<CropsConsulting />} />
              <Route path=":cropId" element={<CropDetail />} />
          </Route>
          <Route path="/recommendations-history" element={<RecommendationsHistory />} />
          <Route path="/profile" element={<FarmerProfile />} />
          <Route path="/login" element={<FarmerLogin />} />
          <Route path="/forgot-password" element={<FarmerForgotPassword />} />
          <Route path="/reset-password" element={<FarmerResetPassword />} /> 
        </Route>
        
        <Route path="*" element={<NotFound/>} />
        <Route path="/" element={<Navigate to="/Home" />} />
      </Routes>
    </>
  )
}

export default App
