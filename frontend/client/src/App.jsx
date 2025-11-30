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

// Admin Pages
import AdminHome from './pages/admin/AdminHome';
import IdeasTable from './pages/admin/IdeasTable';
import IdeaDetails from './pages/admin/IdeaDetails';

// Participant Pages
import MyIdeas from './pages/studentDashboard/MyIdeas';
import IdeaDetail from './pages/studentDashboard/IdeaDetail';

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

          {/* Participant Routes */}
          <Route path="/my-ideas" element={<MyIdeas />} />
          <Route path="/my-ideas/:id" element={<IdeaDetail />} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/ideas" element={<IdeasTable />} />
          <Route path="/admin/ideas/:id" element={<IdeaDetails />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      <Toaster />
    </>
  );
}
