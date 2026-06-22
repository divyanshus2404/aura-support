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

  const handleSend = (text) => {
    if (!text.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text, isBot: false }]);
    setInput("");
    setIsTyping(true);

    // Simulate bot thinking and replying
    setTimeout(() => {
      let reply = "I'm a demo bot, but I can tell you we are awesome! Please book a demo.";
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes("pricing") || lowerText.includes("plan") || lowerText.includes("cost")) {
        reply = "We offer Monthly, Yearly, and Custom Days plans. Our starter plan begins at $19/mo. Check the Pricing section for more details!";
      } else if (lowerText.includes("whatsapp")) {
        reply = "Yes! We fully support WhatsApp integration on our Pro plan and above. It syncs directly with your web dashboard.";
      } else if (lowerText.includes("free trial") || lowerText.includes("free")) {
        reply = "We don't offer a traditional free trial, but you can book a demo, and we can set you up with a test environment!";
      } else if (lowerText.includes("product") || lowerText.includes("available")) {
        reply = "Aura can sync with your inventory to let customers know if products are in stock!";
      }

      setIsTyping(false);
      setMessages(prev => [...prev, { text: reply, isBot: true }]);
    }, 1500);
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
