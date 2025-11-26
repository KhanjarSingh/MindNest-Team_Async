import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import StudentDashboard from './pages/studentDashboard/studentDashboard';
import AddIdea from './pages/studentDashboard/addIdea';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App(){
  return (
    <>
      <Routes>
          {/* Auth Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/studentdashboard" element={<StudentDashboard />} />
          <Route path="/studentdashboard/addidea" element={<AddIdea />} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </>
  );
}
