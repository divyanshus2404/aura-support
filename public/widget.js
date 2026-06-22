(function() {
  // 1. Get configuration from the script tag
  const currentScript = document.currentScript;
  const clientId = currentScript.getAttribute('data-client-id');
  const serverUrl = currentScript.getAttribute('data-server-url') || 'https://ai-support-saas-six.vercel.app'; // Fallback to production if not specified

  if (!clientId) {
    console.error('Aura Support Widget: Missing data-client-id attribute.');
    return;
  }

  // 2. Create the container and attach Shadow DOM
  const container = document.createElement('div');
  container.id = 'aura-support-widget-container';
  document.body.appendChild(container);
  
  const shadow = container.attachShadow({ mode: 'open' });

  // 3. Inject CSS
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@600;700&display=swap');
    
    :host {
      --accent-primary: #2563eb;
      --accent-gradient: linear-gradient(135deg, #2563eb, #7c3aed);
      --text-primary: #0f172a;
      --text-secondary: #64748b;
      --border-color: rgba(0, 0, 0, 0.08);
      --bg-primary: #ffffff;
      font-family: 'Inter', sans-serif;
      font-size: 16px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .widget-wrapper {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647; /* Maximum z-index to stay on top */
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .chatbot-toggle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--accent-gradient);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
      transition: transform 0.2s;
    }
    .chatbot-toggle:hover { transform: scale(1.05); }

    .chatbot-window {
      width: 350px;
      height: 500px;
      background: var(--bg-primary);
      margin-bottom: 16px;
      border-radius: 20px;
      display: none;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15), 0 0 0 1px var(--border-color);
      transform-origin: bottom right;
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .chatbot-window.open { display: flex; }

    @keyframes slideUp {
      from { opacity: 0; transform: scale(0.9) translateY(20px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .header {
      background: var(--accent-gradient);
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .avatar {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
    }

    .title {
      color: white;
      font-family: 'Outfit', sans-serif;
      font-weight: 600;
      font-size: 1.1rem;
    }
    .status {
      color: rgba(255,255,255,0.8);
      font-size: 0.8rem;
    }

    .messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f8fafc;
    }

    .bubble {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 0.95rem;
      line-height: 1.4;
    }

    .bubble.bot {
      background: white;
      align-self: flex-start;
      border: 1px solid var(--border-color);
      border-bottom-left-radius: 4px;
      color: var(--text-primary);
    }

    .bubble.user {
      background: var(--accent-primary);
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }

    .typing {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
    }
    .typing span {
      width: 6px;
      height: 6px;
      background: var(--text-secondary);
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out both;
    }
    .typing span:nth-child(1) { animation-delay: -0.32s; }
    .typing span:nth-child(2) { animation-delay: -0.16s; }
    @keyframes typing {
      0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }

    .input-area {
      padding: 16px;
      background: white;
      border-top: 1px solid var(--border-color);
      display: flex;
      gap: 8px;
    }
    
    .input-area input {
      flex: 1;
      border: 1px solid var(--border-color);
      border-radius: 9999px;
      padding: 8px 16px;
      outline: none;
      font-family: 'Inter', sans-serif;
    }
    .input-area input:focus { border-color: var(--accent-primary); }
    
    .send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--accent-gradient);
      border: none;
      color: white;
      cursor: pointer;
    }
  `;
  shadow.appendChild(style);

  // 4. Inject HTML
  const wrapper = document.createElement('div');
  wrapper.className = 'widget-wrapper';
  
  wrapper.innerHTML = `
    <div class="chatbot-window" id="aura-window">
      <div class="header">
        <div class="avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
        </div>
        <div>
          <div class="title">Support Agent</div>
          <div class="status">⚡ Replies instantly</div>
        </div>
      </div>
      <div class="messages" id="aura-messages">
        <div class="bubble bot">Hi there! I'm the AI assistant. How can I help you today?</div>
      </div>
      <div class="input-area">
        <input type="text" id="aura-input" placeholder="Type your message..." />
        <button class="send-btn" id="aura-send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 2px; margin-top: 2px;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    </div>
    <button class="chatbot-toggle" id="aura-toggle">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    </button>
  `;
  
  shadow.appendChild(wrapper);

  // 5. Logic
  const toggleBtn = shadow.getElementById('aura-toggle');
  const chatWindow = shadow.getElementById('aura-window');
  const messagesContainer = shadow.getElementById('aura-messages');
  const inputField = shadow.getElementById('aura-input');
  const sendBtn = shadow.getElementById('aura-send');

  let isOpen = false;

  toggleBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    if (isOpen) {
      chatWindow.classList.add('open');
      toggleBtn.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    } else {
      chatWindow.classList.remove('open');
      toggleBtn.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
    }
  });

  const appendMessage = (text, sender) => {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${sender}`;
    bubble.textContent = text;
    messagesContainer.appendChild(bubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  const showTyping = () => {
    const typing = document.createElement('div');
    typing.className = 'bubble bot typing';
    typing.id = 'aura-typing';
    typing.innerHTML = `<span></span><span></span><span></span>`;
    messagesContainer.appendChild(typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  const hideTyping = () => {
    const typing = shadow.getElementById('aura-typing');
    if (typing) typing.remove();
  };

  const handleSend = async () => {
    const text = inputField.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    inputField.value = '';
    showTyping();

    try {
      // Use the server URL configured in the script tag, or fallback to the current origin if not provided
      const apiEndpoint = `${serverUrl}/api/chat`.replace(/([^:]\/)\/+/g, "$1"); // prevent double slashes
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          clientId: clientId // Send the business ID so backend knows whose data to use
        })
      });
      const data = await response.json();
      hideTyping();
      appendMessage(data.reply || "Error: Empty response", 'bot');
    } catch (err) {
      console.warn("Backend not reachable. Mocking reply.");
      hideTyping();
      appendMessage("I'm an AI assistant (Demo Mode). The backend server is currently unreachable.", 'bot');
    }
  };

  sendBtn.addEventListener('click', handleSend);
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

})();
