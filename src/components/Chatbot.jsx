import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Aura. I can answer any questions about our product, pricing, or availability.", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const preLoadedQuestions = [
    "What are your pricing plans?",
    "Do you support WhatsApp?",
    "Is there a free trial?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text, isBot: false }]);
    setInput("");
    setIsTyping(true);

    try {
      // Generate a demo customer ID
      let customerId = localStorage.getItem('aura_demo_customer_id');
      if (!customerId) {
        customerId = 'demo_user_' + Math.floor(Math.random() * 10000);
        localStorage.setItem('aura_demo_customer_id', customerId);
      }

      // Try to call the real backend LLM (now a serverless function)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          customerIdentifier: customerId,
          knowledgeBaseContext: "Pricing: $19/mo, $190/yr. WhatsApp is supported." 
        })
      });
      
      const data = await response.json();
      
      setIsTyping(false);
      setMessages(prev => [...prev, { text: data.reply || "Error: Empty response", isBot: true }]);

    } catch (error) {
      console.warn("Backend not reachable. Falling back to mock logic.", error);
      // Fallback if server is offline
      setTimeout(() => {
        let reply = "I'm a demo bot. Our backend server is currently offline or missing API keys.";
        const lowerText = text.toLowerCase();
        if (lowerText.includes("pricing") || lowerText.includes("plan")) {
          reply = "We offer Monthly, Yearly, and Custom plans. Our starter plan begins at $19/mo.";
        } else if (lowerText.includes("whatsapp")) {
          reply = "Yes! We fully support WhatsApp integration.";
        }
        setIsTyping(false);
        setMessages(prev => [...prev, { text: reply, isBot: true }]);
      }, 1000);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {/* Toggle Button */}
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} color="white" /> : <MessageSquare size={24} color="white" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window glass-panel">
          <div className="chatbot-header">
            <div className="chatbot-avatar">
              <Bot size={20} color="white" />
            </div>
            <div>
              <h4 className="chatbot-title">Aura Sales Agent</h4>
              <span className="chatbot-status">Online</span>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble ${msg.isBot ? 'bot' : 'user'}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble bot typing-indicator">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-suggestions">
            {preLoadedQuestions.map((q, index) => (
              <button 
                key={index} 
                className="suggestion-btn"
                onClick={() => handleSend(q)}
                disabled={isTyping}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="chatbot-input-area">
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              disabled={isTyping}
            />
            <button className="send-btn" onClick={() => handleSend(input)} disabled={isTyping}>
              <Send size={18} color="white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
