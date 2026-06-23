import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="legal-page">
      <div className="legal-container animate-fade-up glass-panel" style={{maxWidth: '800px', margin: '4rem auto', padding: '3rem', borderRadius: '16px'}}>
        <Link to="/" className="btn btn-secondary mb-2" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem'}}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 className="text-gradient">Terms of Service</h1>
        <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="legal-content" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.6'}}>
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using Aura Support ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>Aura Support provides businesses with AI-powered chatbot solutions, utilizing Google Generative AI to answer customer inquiries based on uploaded knowledge bases.</p>
          </section>

          <section>
            <h2>3. Account Registration & Security</h2>
            <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials. We use Supabase for secure authentication.</p>
          </section>

          <section>
            <h2>4. Payments and Billing</h2>
            <p>Paid services are billed on a subscription basis via our third-party payment processor, Stripe. You agree to provide current, complete, and accurate purchase and account information.</p>
          </section>

          <section>
            <h2>5. User Data and AI Processing</h2>
            <p>By uploading documents to our knowledge base, you grant us permission to process this data through Google Generative AI to formulate responses for your customers. You represent that you have the right to upload and process this data.</p>
          </section>

          <section>
            <h2>6. Limitation of Liability</h2>
            <p>In no event shall Aura Support be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the Service or the AI's generated responses.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
