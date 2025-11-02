import React from 'react';
import { Link } from 'react-router-dom';

export default function Nav(){
  return (
    <nav style={{ padding: 10, borderBottom: '1px solid #ddd' }}>
      <Link to="/" style={{ marginRight: 10 }}>Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}
