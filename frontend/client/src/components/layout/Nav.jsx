import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import './Nav.css';

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={isScrolled ? 'navbar scrolled' : 'navbar'}>
      <div className="navbar-left">
        <Link to="/hackathons" className="navbar-link">Upcoming hackathons</Link>
        <Link to="/community" className="navbar-link">Community</Link>
        <Link to="/about" className="navbar-link">About Us</Link>
        <Link to="/contact" className="navbar-link">Contact</Link>
      </div>

      <div className="navbar-right">
        <Link to="/profile" className="navbar-link profile-icon" title="Profile">
          <AccountCircleIcon />
        </Link>
      </div>
    </nav>
  );
}