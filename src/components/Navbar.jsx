import React from 'react';
import { Bot, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <nav className="navbar glass-panel">
      <div className="container nav-container">
        <div className="nav-logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="logo-icon">
              <Bot size={24} color="white" />
            </div>
            <span className="logo-text">Aura <span className="text-gradient">Support</span></span>
          </Link>
        </div>
        <ul className="nav-links">
          <li><a href="/#features">Features</a></li>
          <li><a href="/#pricing">Pricing</a></li>
          <li><Link to="/auth">Dashboard</Link></li>
        </ul>
        <div className="nav-actions">
          <button className="btn btn-secondary nav-login" onClick={toggleDarkMode} style={{ padding: '0.5rem', borderRadius: '50%' }}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/auth" className="btn btn-secondary nav-login">Log In</Link>
          <a href="/#pricing" className="btn btn-primary">Get Started</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
