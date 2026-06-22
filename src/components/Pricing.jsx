import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Pricing.css';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    fetchSession();
  }, []);

  const plans = {
    weekly: [
      { name: "Starter", price: "$9", period: "/week", features: ["1,000 AI Queries", "Website Widget", "Standard Support"] },
      { name: "Pro", price: "$29", period: "/week", features: ["10,000 AI Queries", "WhatsApp Integration", "Priority Support", "Knowledge Base Sync"], popular: true },
      { name: "Enterprise", price: "$99", period: "/week", features: ["Unlimited Queries", "Custom Bot Personality", "Dedicated Success Manager"] }
    ],
    monthly: [
      { name: "Starter", price: "$19", period: "/mo", features: ["1,000 AI Queries", "Website Widget", "Standard Support"] },
      { name: "Pro", price: "$49", period: "/mo", features: ["10,000 AI Queries", "WhatsApp Integration", "Priority Support", "Knowledge Base Sync"], popular: true },
      { name: "Enterprise", price: "$199", period: "/mo", features: ["Unlimited Queries", "Custom Bot Personality", "Dedicated Success Manager"] }
    ],
    yearly: [
      { name: "Starter", price: "$190", period: "/yr", features: ["1,000 AI Queries/mo", "Website Widget", "Standard Support"] },
      { name: "Pro", price: "$490", period: "/yr", features: ["10,000 AI Queries/mo", "WhatsApp Integration", "Priority Support", "Knowledge Base Sync"], popular: true },
      { name: "Enterprise", price: "$1990", period: "/yr", features: ["Unlimited Queries/mo", "Custom Bot Personality", "Dedicated Success Manager"] }
    ]
  };

  const getPlans = () => {
    if (billingCycle === 'weekly') return plans.weekly;
    if (billingCycle === 'yearly') return plans.yearly;
    return plans.monthly;
  };

  const handleCheckout = async (planName) => {
    try {
      const response = await fetch('http://localhost:5000/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId: planName,
          userId: userId // Pass real user ID to Stripe
        })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      }
    } catch (error) {
      console.warn("Backend not reachable. Mocking Stripe redirect.");
      alert(`[Mock] Redirecting to Stripe Checkout for ${planName}...`);
    }
  };

  return (
    <section id="pricing" className="pricing">
      <div className="container">
        <h2 className="section-title">Simple, Transparent <span className="text-gradient">Pricing</span></h2>
        <p className="section-subtitle">
          Whether you're a startup or an enterprise, we have a plan designed to help you sell more and support better.
        </p>

        <div className="billing-toggle">
          <button 
            className={`toggle-btn ${billingCycle === 'weekly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('weekly')}
          >
            Custom Days
          </button>
          <button 
            className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`toggle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly <span className="save-badge">Save 16%</span>
          </button>
        </div>

        <div className="pricing-grid">
          {getPlans().map((plan, index) => (
            <div key={index} className={`pricing-card glass-panel ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                <span className="price">{plan.price}</span>
                <span className="period">{plan.period}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <CheckCircle2 size={20} className="check-icon" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} full-width`}
                onClick={() => handleCheckout(plan.name)}
              >
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
