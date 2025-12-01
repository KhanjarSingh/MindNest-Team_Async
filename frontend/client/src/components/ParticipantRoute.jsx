import { Navigate } from 'react-router-dom';
import { isAdmin } from '../services/authService';

const ParticipantRoute = ({ children }) => {
  return !isAdmin() ? children : <Navigate to="/admin-dashboard" replace />;
};

export default ParticipantRoute;