import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader } from 'lucide-react';
import './Dashboard.css';

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
      setLoading(false);
    });
  }, [navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // On successful signup, redirect to onboarding flow
        navigate('/onboarding');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (error) {
      setAuthError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="login-screen"><Loader className="animate-spin" size={40} /></div>;
  }

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
};

export default Auth;
