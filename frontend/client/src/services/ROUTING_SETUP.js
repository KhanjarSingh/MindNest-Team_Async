/**
 * ROUTING SETUP GUIDE
 * 
 * Add these routes to your App.jsx or main routing file
 * This requires React Router v6+
 */

// Example App.jsx setup:
/*

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import StudentDashboard from './pages/studentDashboard/studentDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<StudentDashboard />} />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

*/

// Optional: Protected Route Wrapper
/*

import { Navigate } from 'react-router-dom';
import { getAuthToken } from '../services/authService';

export default function ProtectedRoute({ element }) {
  const token = getAuthToken();
  
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  
  return element;
}

// Usage:
// <Route path="/dashboard" element={<ProtectedRoute element={<StudentDashboard />} />} />

*/
