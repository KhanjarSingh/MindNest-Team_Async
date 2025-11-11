import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import StudentDashboard from './pages/studentDashboard/studentDashboard';
import AddIdea from './pages/studentDashboard/addIdea';

export default function App(){
  return (
    <>
      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/studentdashboard" element={<StudentDashboard />} />
          <Route path="/studentdashboard/addidea" element={<AddIdea />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
