import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Database, MessageSquare, Settings, UploadCloud, Users, LogOut, Search, Sliders, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Knowledge Base State
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Chat Logs State
  const [chatLogs, setChatLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  
  // Profile State
  const [businessProfile, setBusinessProfile] = useState(null);

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

  const fetchProfile = async () => {
    if (!session) return;
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (data) setBusinessProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchChatLogs = async () => {
    if (!session) return;
    setLogsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_logs')
        .select('*')
        .eq('business_id', session.user.id)
        .order('created_at', { ascending: false }); // Fetch all for stats, ideally paginate later
        
      if (data) setChatLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchProfile();
      fetchChatLogs(); // Fetch on load so overview stats have data immediately
      if (activeTab === 'knowledge') fetchFiles();
    }
  }, [session, activeTab]);

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

  // Real Analytics Calculations
  const uniqueCustomers = new Set(chatLogs.map(log => log.customer_identifier)).size;
  const currentPlan = businessProfile?.subscription_tier === 'pro' ? 'Pro Plan' : 'Free Tier';
  const waStatus = businessProfile?.whatsapp_token ? 'Connected' : 'Not Configured';

  const stats = [
    { label: "Total Queries Handled", value: chatLogs.length.toString() },
    { label: "Unique Customers Helped", value: uniqueCustomers.toString() },
    { label: "Active Plan", value: currentPlan, status: businessProfile?.subscription_tier === 'pro' ? 'good' : '' },
    { label: "WhatsApp Status", value: waStatus, status: businessProfile?.whatsapp_token ? 'good' : '' }
  ];

  if (loading) {
    return <div className="login-screen"><Loader className="animate-spin" size={40} /></div>;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
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
            <div className="chatlogs-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3>Recent Conversations</h3>
              <button className="btn btn-secondary" onClick={fetchChatLogs} disabled={logsLoading}>
                {logsLoading ? 'Refreshing...' : 'Refresh Logs'}
              </button>
            </div>
            <table className="chatlogs-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Platform</th>
                  <th>Message Preview</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {chatLogs.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No chat logs found for your agent yet.</td></tr>
                ) : (
                  chatLogs.map(log => {
                    const firstMessage = log.message_history && log.message_history.length > 0 
                      ? log.message_history[0].content 
                      : 'No message content';
                      
                    return (
                      <tr key={log.id}>
                        <td>{log.customer_identifier}</td>
                        <td><span className={`platform-badge ${log.platform.toLowerCase().replace(' ', '-')}`}>{log.platform}</span></td>
                        <td style={{maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                          "{firstMessage}"
                        </td>
                        <td>{new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString()}</td>
                        <td>
                          <span className={`status-badge success`}>Resolved</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
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
