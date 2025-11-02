import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from '../components/Nav';
import Home from '../pages/Home';
import About from '../pages/About';
import NotFound from '../pages/NotFound';

export default function App(){
  return (
    <>
      <Nav />
      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
