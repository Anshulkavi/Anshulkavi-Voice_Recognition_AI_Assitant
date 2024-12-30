import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hello! I'm AURA+. How can I assist you today?", sender: 'bot' },
  ]);

  const addMessage = (text, sender) => {
    setMessages(prevMessages => [...prevMessages, { text, sender }]);
    if (sender === 'bot') {
      speak(text);
    }
  };

  const getAuraResponse = async (message) => {
    try {
      const response = await fetch('/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: message }),
      });
      const data = await response.json();
      return response.ok ? data.response : 'Something went wrong.';
    } catch (error) {
      console.error("Error:", error);
      return 'Something went wrong.';
    }
  };

  const handleUserInput = async (inputMessage = userMessage) => {
    if (inputMessage.trim()) {
      addMessage(inputMessage, 'user');
      const response = await getAuraResponse(inputMessage);
      addMessage(response, 'bot');
      setUserMessage('');
    }
  };

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
  };

  const startVoiceRecognition = () => {
    // Stop ongoing speech
    window.speechSynthesis.cancel();
  
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = false;
    recognition.lang = 'en-US';
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleUserInput(transcript);
    };
  
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      addMessage('Could not understand the speech. Please try again.', 'bot');
    };
  
    recognition.start();
  };
  

  return (
    <div className="container">
      <header>
        <h1 className="logo">
          AURA<span className="plus">+</span>
        </h1>
        <p>Your Futuristic AI Assistant</p>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet"></link>
      </header>
      <main>
        <div id="chat-container">
          <div id="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}-message`}>
                {msg.text}
              </div>
            ))}
          </div>
        </div>
        <div id="input-container">
          <input
            type="text"
            id="user-input"
            placeholder="Type your message..."
            aria-label="Type your message"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUserInput()}
          />
          <button id="voice-btn" className="btn" aria-label="Voice input" onClick={startVoiceRecognition}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" x2="12" y1="19" y2="22"></line>
            </svg>
          </button>
          <button id="send-btn" className="btn" aria-label="Send message" onClick={() => handleUserInput()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" x2="11" y1="2" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </main>
      <footer>
        <p>© 2024 AURA+ AI Assistant. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
