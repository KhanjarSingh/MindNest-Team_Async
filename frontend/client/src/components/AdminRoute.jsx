import { Navigate } from 'react-router-dom';
import { isAdmin } from '../services/authService';

const AdminRoute = ({ children }) => {
  return isAdmin() ? children : <Navigate to="/" replace />;
};

export default AdminRoute;