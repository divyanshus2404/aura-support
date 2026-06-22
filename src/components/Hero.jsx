import React from 'react';
import { ArrowRight, MessageSquare, Smartphone, BellRing } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      
      <div className="container hero-container">
        <div className="hero-content animate-fade-up">
          <div className="hero-badge">
            <span className="badge-text">✨ Meet Aura - The Future of Support</span>
          </div>
          <h1 className="hero-title">
            Automate Your Customer Support with <span className="text-gradient">Human-like AI</span>
          </h1>
          <p className="hero-description">
            Connect with your customers 24/7 on WhatsApp and your Website. Aura handles queries, checks product availability, and drives sales while you sleep.
          </p>
          
          <div className="hero-actions">
            <a href="#pricing" className="btn btn-primary hero-btn">
              Get Started Free <ArrowRight size={20} className="ml-2" />
            </a>
            <a href="#demo" className="btn btn-secondary hero-btn">
              Book a Demo
            </a>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">24/7</span>
              <span className="stat-label">Availability</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">98%</span>
              <span className="stat-label">Resolution Rate</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">10x</span>
              <span className="stat-label">Faster Replies</span>
            </div>
          </div>
        </div>
        
        <div className="hero-visual animate-fade-up delay-200">
          <div className="glass-panel mockup-panel">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span></span><span></span><span></span>
              </div>
              <div className="mockup-title">Aura Support Dashboard</div>
            </div>
            <div className="mockup-body">
              <div className="chat-bubble received">
                <div className="chat-avatar"><Smartphone size={16}/></div>
                <div className="chat-text">Hi, is the Premium Plan available?</div>
              </div>
              <div className="chat-bubble sent">
                <div className="chat-avatar bg-gradient"><MessageSquare size={16} color="white"/></div>
                <div className="chat-text">Yes! The Premium Plan is fully available. Would you like a link to upgrade?</div>
              </div>
            </div>
            
            {/* Floating Notification Cards */}
            <div className="floating-card notification-1 glass-panel">
              <BellRing size={16} color="var(--accent-primary)" />
              <div className="notif-text">
                <strong>New Sale</strong>
                <span>via WhatsApp Chat</span>
              </div>
            </div>
            
            <div className="floating-card notification-2 glass-panel">
               <MessageSquare size={16} color="var(--accent-secondary)" />
              <div className="notif-text">
                <strong>Query Resolved</strong>
                <span>Instant response time</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
