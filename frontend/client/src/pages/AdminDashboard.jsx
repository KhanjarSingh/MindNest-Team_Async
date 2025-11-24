import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import '../styles/dashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/signin');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="work-in-progress">
          <div className="progress-icon">🚀</div>
          <h2>Work Going On…</h2>
          <p>Admin dashboard features coming soon</p>
        </div>
      </div>
    </div>
  );
}
