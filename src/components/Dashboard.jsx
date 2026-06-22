import React, { useState, useEffect } from 'react';
import { Database, MessageSquare, Settings, UploadCloud, Users, LogOut, Search, Sliders, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState(null);
  
  // Knowledge Base State
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the login link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !session) return;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('knowledge_base')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      
      alert('File uploaded successfully! Your AI is retraining.');
      fetchFiles();
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const fetchFiles = async () => {
    if (!session) return;
    const { data, error } = await supabase.storage
      .from('knowledge_base')
      .list(session.user.id + '/', { limit: 10 });
      
    if (data) setFiles(data);
  };

  useEffect(() => {
    if (session && activeTab === 'knowledge') {
      fetchFiles();
    }
  }, [session, activeTab]);

  // Mock data for UI
  const stats = [
    { label: "Total Queries Handled", value: "1,248" },
    { label: "Sales Converted", value: "$4,290" },
    { label: "Active Plan", value: "Pro (Yearly)" },
    { label: "WhatsApp Status", value: "Connected", status: "good" }
  ];

  const mockChatLogs = [
    { id: 1, user: "+1 (555) 019-2834", platform: "WhatsApp", intent: "Pricing Inquiry", time: "10 mins ago", status: "Resolved" },
    { id: 2, user: "guest_8912@web", platform: "Website", intent: "Product Availability", time: "1 hour ago", status: "Resolved" },
  ];

  if (loading && !session) {
    return <div className="login-screen"><Loader className="animate-spin" size={40} /></div>;
  }

  if (!session) {
    return (
      <div className="login-screen">
        <div className="glass-panel login-panel animate-fade-up">
          <h2>{isSignUp ? 'Create Account' : 'Admin Login'}</h2>
          <p>{isSignUp ? 'Sign up to build your AI agent.' : 'Sign in to manage your Aura AI Agent.'}</p>
          
          <form onSubmit={handleAuth} style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            {authError && <div style={{color:'#ef4444', fontSize:'0.85rem'}}>{authError}</div>}
            
            <button type="submit" className="btn btn-primary full-width" disabled={loading}>
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>
          
          <div className="mt-2 text-center" style={{fontSize: '0.9rem'}}>
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button className="text-gradient" onClick={() => setIsSignUp(!isSignUp)} style={{background:'none', border:'none', cursor:'pointer', fontWeight:'bold'}}>
              {isSignUp ? 'Log in' : 'Sign up'}
            </button>
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
          <h3 style={{wordBreak: 'break-all'}}>{session.user.email}</h3>
          <span className="sidebar-badge">Business Account</span>
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
          <button className={`sidebar-link ${activeTab === 'installation' ? 'active' : ''}`} onClick={() => setActiveTab('installation')}>
            <Sliders size={18} /> Installation
          </button>
          <button className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={18} /> Settings
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-link" onClick={handleLogout}>
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

        {activeTab === 'installation' && (
          <div className="installation-section glass-panel" style={{padding: '3rem'}}>
            <h3>Embed Your AI Agent</h3>
            <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>
              Copy and paste this snippet into the <code>&lt;head&gt;</code> or just before the closing <code>&lt;/body&gt;</code> tag of your website (Shopify, WordPress, Webflow, etc.).
            </p>
            
            <div style={{background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', position: 'relative'}}>
              <code style={{fontFamily: 'monospace', color: 'var(--text-primary)', wordBreak: 'break-all'}}>
                &lt;script src="https://ai-support-saas-six.vercel.app/widget.js" data-client-id="{session.user.id}" defer&gt;&lt;/script&gt;
              </code>
              <button 
                className="btn btn-secondary" 
                style={{position: 'absolute', top: '1rem', right: '1rem'}}
                onClick={() => {
                  navigator.clipboard.writeText(`<script src="https://ai-support-saas-six.vercel.app/widget.js" data-client-id="${session.user.id}" defer></script>`);
                  alert('Copied to clipboard!');
                }}
              >
                Copy Code
              </button>
            </div>
            
            <div className="mt-2" style={{padding: '1rem', background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: '8px', color: 'var(--accent-primary)'}}>
              <strong>Note:</strong> Our widget uses Shadow DOM technology. This means it is completely isolated and guaranteed not to conflict with your website's existing CSS or themes!
            </div>
          </div>
        )}

        {activeTab === 'chatlogs' && (
          <div className="chatlogs-section glass-panel">
            <div className="chatlogs-header">
              <h3>Recent Conversations</h3>
            </div>
            <table className="chatlogs-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Platform</th>
                  <th>Intent</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockChatLogs.map(log => (
                  <tr key={log.id}>
                    <td>{log.user}</td>
                    <td><span className={`platform-badge ${log.platform.toLowerCase()}`}>{log.platform}</span></td>
                    <td>{log.intent}</td>
                    <td>
                      <span className={`status-badge ${log.status === 'Resolved' ? 'success' : 'warning'}`}>{log.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2" style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>* Logs are mocked until live traffic arrives.</p>
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div className="knowledge-section glass-panel">
            <h3>Train Your AI Agent</h3>
            <p>Upload your company PDFs, return policies, and product lists.</p>
            
            <label className="upload-box">
              {uploading ? <Loader className="animate-spin" size={40} color="var(--accent-primary)" /> : <UploadCloud size={40} color="var(--accent-primary)" />}
              <span>{uploading ? 'Uploading...' : 'Click to browse files'}</span>
              <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Supports PDF, TXT (Max 10MB)</p>
              <input type="file" style={{display: 'none'}} onChange={handleFileUpload} disabled={uploading} accept=".pdf,.txt,.csv" />
            </label>

            <div className="uploaded-files mt-2">
              <h4>Currently Trained On:</h4>
              <ul>
                {files.length === 0 ? <p style={{color:'var(--text-secondary)'}}>No files uploaded yet.</p> : 
                  files.map((file, i) => (
                    <li key={i}>📄 {file.name} <span className="text-green">Active</span></li>
                  ))
                }
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
