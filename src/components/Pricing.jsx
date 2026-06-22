import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import './Pricing.css';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly, yearly, weekly

  const getPlans = () => {
    switch(billingCycle) {
      case 'yearly':
        return [
          { name: 'Starter', price: '$150', period: '/year', features: ['Web Support', '1,000 Queries/mo', 'Basic Analytics'] },
          { name: 'Pro', price: '$190', period: '/year', features: ['WhatsApp + Web', 'Unlimited Queries', 'Product Sync', 'Advanced Analytics'], popular: true },
          { name: 'Enterprise', price: 'Custom', period: '', features: ['Custom LLM Fine-tuning', 'Dedicated Account Manager', 'SLA Guarantee'] }
        ];
      case 'weekly':
        return [
          { name: 'Event Basic', price: '$9', period: '/week', features: ['Web Support', 'Ideal for short campaigns', 'Basic Analytics'] },
          { name: 'Event Pro', price: '$19', period: '/week', features: ['WhatsApp + Web', 'Ideal for product launches', 'Product Sync'], popular: true },
        ];
      default: // monthly
        return [
          { name: 'Starter', price: '$19', period: '/mo', features: ['Web Support', '1,000 Queries/mo', 'Basic Analytics'] },
          { name: 'Pro', price: '$49', period: '/mo', features: ['WhatsApp + Web', 'Unlimited Queries', 'Product Sync', 'Advanced Analytics'], popular: true },
          { name: 'Enterprise', price: 'Custom', period: '', features: ['Custom LLM Fine-tuning', 'Dedicated Account Manager', 'SLA Guarantee'] }
        ];
    }
  };

  const handleCheckout = async (planName) => {
    try {
      const response = await fetch('http://localhost:5000/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: planName }) // Passing name as mock ID
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
