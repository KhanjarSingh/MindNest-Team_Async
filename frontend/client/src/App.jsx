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

import { Toaster } from '@/components/ui/toaster';

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
          <Route path="/hackathons" element={<HackathonsPage />} />
          <Route path="/addidea" element={<AddIdea />} />
          {/* <Route path="/test" element={<TestPage />} /> */}


          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      <Toaster />
    </>
  );
}
