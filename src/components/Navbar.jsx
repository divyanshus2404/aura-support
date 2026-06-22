import React from 'react';
import { Bot } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar glass-panel">
      <div className="container nav-container">
        <div className="nav-logo">
          <div className="logo-icon">
            <Bot size={24} color="white" />
          </div>
          <span className="logo-text">Aura <span className="text-gradient">Support</span></span>
        </div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#demo">Demo</a></li>
        </ul>
        <div className="nav-actions">
          <a href="#login" className="btn btn-secondary nav-login">Log In</a>
          <a href="#pricing" className="btn btn-primary">Get Started</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
