import React, { useState } from 'react';
import { Database, MessageSquare, Settings, UploadCloud, Users } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Placeholder data for the mock dashboard
  const stats = [
    { label: "Total Queries Handled", value: "1,248" },
    { label: "Sales Converted", value: "$4,290" },
    { label: "Active Plan", value: "Pro (Yearly)" },
    { label: "WhatsApp Status", value: "Connected", status: "good" }
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar glass-panel">
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Database size={18} /> Overview
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'chatlogs' ? 'active' : ''}`}
            onClick={() => setActiveTab('chatlogs')}
          >
            <MessageSquare size={18} /> Chat Logs
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'knowledge' ? 'active' : ''}`}
            onClick={() => setActiveTab('knowledge')}
          >
            <UploadCloud size={18} /> Knowledge Base
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} /> Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h2>Welcome back, ACME Corp!</h2>
          <p>Here's how Aura Support is performing today.</p>
        </header>

        {activeTab === 'overview' && (
          <div className="dashboard-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card glass-panel">
                <span className="stat-card-label">{stat.label}</span>
                <span className={`stat-card-value ${stat.status === 'good' ? 'text-green' : ''}`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div className="knowledge-section glass-panel">
            <h3>Train Your AI</h3>
            <p>Upload PDFs, FAQs, or paste website URLs to train your AI agent.</p>
            <div className="upload-box">
              <UploadCloud size={40} color="var(--text-secondary)" />
              <span>Drag & drop files here, or click to browse</span>
              <button className="btn btn-primary mt-2">Upload File</button>
            </div>
          </div>
        )}

        {/* Supabase / Auth Placeholder Notice */}
        <div className="demo-notice">
          <strong>Note:</strong> This dashboard is currently a UI mockup. In production, this will be connected to a secure Supabase Database for real authentication and data storage.
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
