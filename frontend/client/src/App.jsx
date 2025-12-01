import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './components/About';
import NotFound from './pages/NotFound';

import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import AdminDashboard from './pages/AdminDashboard';
import HackathonsPage from './pages/HackathonsPage';
import AddIdea from './pages/studentDashboard/SubmitYourIdea';
import AdminRoute from './components/AdminRoute';
import ParticipantRoute from './components/ParticipantRoute';

import { Toaster } from '@/components/ui/toaster';

export default function App(){
  return (
    <>
      <Routes>
          {/* Auth Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Main Routes */}
          <Route path="/" element={<ParticipantRoute><Home /></ParticipantRoute>} />
          <Route path="/about" element={<ParticipantRoute><About /></ParticipantRoute>} />
          <Route path="/hackathons" element={<ParticipantRoute><HackathonsPage /></ParticipantRoute>} />
          <Route path="/addidea" element={<ParticipantRoute><AddIdea /></ParticipantRoute>} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      <Toaster />
    </>
  );
}
