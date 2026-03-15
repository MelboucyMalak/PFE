import MapComponent from '../../components/map/MapComponent';

export default function FarmerDashboard() {
  return (
    <div>
      <h1>Welcome to the Farmer Dashboard</h1>
      <p>Here you can manage your crops, view weather forecasts, and access farming resources.</p>
      <MapComponent />
    </div>
  );
}