import React from 'react';
import { Bot, Globe, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="nav-logo" style={{ marginBottom: '1rem' }}>
            <div className="logo-icon">
              <Bot size={24} color="white" />
            </div>
            <span className="logo-text">Aura <span className="text-gradient">Support</span></span>
          </div>
          <p className="footer-description">
            The next-generation AI support agent for modern businesses. Provide instant, human-like answers 24/7 on Web and WhatsApp.
          </p>
          <div className="social-links">
            <a href="#"><Globe size={20} /></a>
            <a href="#"><Mail size={20} /></a>
            <a href="#"><Phone size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <div className="link-column">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#integrations">Integrations</a></li>
              <li><a href="#changelog">Changelog</a></li>
            </ul>
          </div>
          <div className="link-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="link-column">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Aura Support SaaS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
