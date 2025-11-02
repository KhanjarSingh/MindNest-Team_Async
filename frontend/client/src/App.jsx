import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from '../src/components/layout/Nav';
import Home from '../src/pages/Home';
import About from '../src/pages/About';
import NotFound from '../src/pages/NotFound';

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
