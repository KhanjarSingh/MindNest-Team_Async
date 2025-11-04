import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../src/pages/Home';
import About from '../src/pages/About';
import NotFound from '../src/pages/NotFound';
import StudentDashboard from '../src/pages/studentDashboard/studentDashboard';


export default function App(){
  return (
    <>
      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/studentdashboard" element={<StudentDashboard />} />
        </Routes>
      </main>
    </>
  );
}
