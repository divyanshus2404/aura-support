import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="legal-page">
      <div className="legal-container animate-fade-up glass-panel" style={{maxWidth: '800px', margin: '4rem auto', padding: '3rem', borderRadius: '16px'}}>
        <Link to="/" className="btn btn-secondary mb-2" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem'}}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 className="text-gradient">Privacy Policy</h1>
        <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="legal-content" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.6'}}>
          <section>
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us when creating an account, including your email address and company details. We also collect the documents and files you upload to train your AI assistant.</p>
          </section>

          <section>
            <h2>2. Chat Logs and End-User Data</h2>
            <p>We collect and store chat logs between your customers and the AI widget. This data is stored securely in our database (powered by Supabase) to provide you with Analytics and Chat History in your dashboard.</p>
          </section>

          <section>
            <h2>3. How We Use Information</h2>
            <p>We use the information we collect to operate and improve our services, process transactions (via Stripe), and generate accurate AI responses using our partner, Google Generative AI.</p>
          </section>

          <section>
            <h2>4. Third-Party Services</h2>
            <p>Your data may be processed by our trusted sub-processors:</p>
            <ul>
              <li><strong>Supabase:</strong> For secure database hosting and authentication.</li>
              <li><strong>Stripe:</strong> For secure payment processing. We do not store your full credit card information.</li>
              <li><strong>Google:</strong> For processing text through the Gemini AI model.</li>
              <li><strong>Vercel:</strong> For secure website and API hosting.</li>
            </ul>
          </section>

          <section>
            <h2>5. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect the security of your personal information, including Row Level Security (RLS) to ensure business data is isolated.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
