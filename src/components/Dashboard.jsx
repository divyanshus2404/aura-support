import React, { useState } from 'react';
import { Database, MessageSquare, Settings, UploadCloud, Users, LogOut, Search, Sliders } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mock data
  const stats = [
    { label: "Total Queries Handled", value: "1,248" },
    { label: "Sales Converted", value: "$4,290" },
    { label: "Active Plan", value: "Pro (Yearly)" },
    { label: "WhatsApp Status", value: "Connected", status: "good" }
  ];

  const mockChatLogs = [
    { id: 1, user: "+1 (555) 019-2834", platform: "WhatsApp", intent: "Pricing Inquiry", time: "10 mins ago", status: "Resolved" },
    { id: 2, user: "guest_8912@web", platform: "Website", intent: "Product Availability", time: "1 hour ago", status: "Resolved" },
    { id: 3, user: "+44 7700 900077", platform: "WhatsApp", intent: "Support / Refund", time: "3 hours ago", status: "Needs Human" },
  ];

  if (!isLoggedIn) {
    return (
      <div className="login-screen">
        <div className="glass-panel login-panel animate-fade-up">
          <h2>Admin Login</h2>
          <p>Sign in to manage your Aura AI Agent.</p>
          <input type="email" placeholder="Email address" defaultValue="demo@acmecorp.com" />
          <input type="password" placeholder="Password" defaultValue="password123" />
          <button className="btn btn-primary full-width mt-2" onClick={() => setIsLoggedIn(true)}>Sign In</button>
          <div className="demo-notice mt-2" style={{fontSize: '0.8rem'}}>
            (Mock Login: Click Sign In to view the dashboard)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout animate-fade-up">
      {/* Sidebar */}
      <aside className="dashboard-sidebar glass-panel">
        <div className="sidebar-header">
          <h3>ACME Corp</h3>
          <span className="sidebar-badge">Pro Plan</span>
        </div>
        <nav className="sidebar-nav">
          <button className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <Database size={18} /> Overview
          </button>
          <button className={`sidebar-link ${activeTab === 'chatlogs' ? 'active' : ''}`} onClick={() => setActiveTab('chatlogs')}>
            <MessageSquare size={18} /> Chat Logs
          </button>
          <button className={`sidebar-link ${activeTab === 'knowledge' ? 'active' : ''}`} onClick={() => setActiveTab('knowledge')}>
            <UploadCloud size={18} /> Knowledge Base
          </button>
          <button className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={18} /> Settings
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-link" onClick={() => setIsLoggedIn(false)}>
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h2>Dashboard {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
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

        {activeTab === 'chatlogs' && (
          <div className="chatlogs-section glass-panel">
            <div className="chatlogs-header">
              <h3>Recent Conversations</h3>
              <div className="search-bar">
                <Search size={16} />
                <input type="text" placeholder="Search phone numbers or IDs..." />
              </div>
            </div>
            <table className="chatlogs-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Platform</th>
                  <th>Detected Intent</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockChatLogs.map(log => (
                  <tr key={log.id}>
                    <td>{log.user}</td>
                    <td><span className={`platform-badge ${log.platform.toLowerCase()}`}>{log.platform}</span></td>
                    <td>{log.intent}</td>
                    <td>{log.time}</td>
                    <td>
                      <span className={`status-badge ${log.status === 'Resolved' ? 'success' : 'warning'}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div className="knowledge-section glass-panel">
            <h3>Train Your AI Agent</h3>
            <p>Upload your company PDFs, return policies, and product lists.</p>
            <div className="upload-box">
              <UploadCloud size={40} color="var(--accent-primary)" />
              <span>Drag & drop files here, or click to browse</span>
              <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Supports PDF, TXT, CSV (Max 10MB)</p>
              <button className="btn btn-secondary mt-2">Select Files</button>
            </div>
            <div className="uploaded-files mt-2">
              <h4>Currently Trained On:</h4>
              <ul>
                <li>📄 acme_return_policy.pdf <span className="text-green">Active</span></li>
                <li>📄 Q3_inventory_list.csv <span className="text-green">Active</span></li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section glass-panel">
            <h3>Agent Settings</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Bot Personality</h4>
                  <p>Choose how Aura talks to your customers.</p>
                </div>
                <select className="settings-select" defaultValue="friendly">
                  <option value="professional">Strict & Professional</option>
                  <option value="friendly">Friendly & Casual</option>
                  <option value="sales">Aggressive Sales</option>
                </select>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Human Handoff</h4>
                  <p>Transfer to a real agent if Aura can't answer.</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>WhatsApp Integration</h4>
                  <p>Manage your Meta Developer Tokens.</p>
                </div>
                <button className="btn btn-secondary"><Sliders size={16} className="mr-2"/> Manage Keys</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
