import React from 'react';
import { MessageCircle, ShoppingBag, Zap } from 'lucide-react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: <MessageCircle size={32} color="white" />,
      title: "Omnichannel Support",
      description: "Seamlessly integrate with WhatsApp and your Website. Provide consistent, instant answers wherever your customers are."
    },
    {
      icon: <ShoppingBag size={32} color="white" />,
      title: "Product Availability Sync",
      description: "Aura connects to your inventory to give real-time updates on product availability and pricing to inquiring customers."
    },
    {
      icon: <Zap size={32} color="white" />,
      title: "Human-Like Interactions",
      description: "Powered by advanced LLMs, Aura understands context, empathy, and sales intent to drive conversions naturally."
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <h2 className="section-title">Why Choose <span className="text-gradient">Aura Support?</span></h2>
        <p className="section-subtitle">
          Designed specifically for modern businesses looking to scale without expanding their support headcount.
        </p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card glass-panel animate-fade-up delay-100">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
