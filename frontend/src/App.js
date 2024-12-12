import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful assistant.' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Update this to your backend URL if changed
  const backendUrl = 'https://my-chat-app-1-0ktg.onrender.com';

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    const newMessages = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/chat`, { 
        messages: newMessages,
        model: model
      });
      const assistantReply = res.data.reply;
      setMessages([...newMessages, { role: 'assistant', content: assistantReply }]);
    } catch (error) {
      console.error(error);
      setStatusMessage('Error sending message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={outerContainerStyle}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

          body {
            margin: 0;
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%);
          }

          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #fef9ff;
          }
          ::-webkit-scrollbar-thumb {
            background: #a6c1ee;
            border-radius: 4px;
          }

          .button {
            transition: background 0.3s ease, transform 0.1s ease;
          }
          .button:hover {
            background: #a5f2e7;
          }
          .button:active {
            transform: scale(0.97);
          }
        `}
      </style>
      <div style={containerStyle}>
        <h1 style={headingStyle}>Chat Gbt Clone</h1>
        <p style={paragraphStyle}>Choose a model and start chatting!</p>

        <div style={modelSelectContainer}>
          <label style={labelStyle}>Model: </label>
          <select value={model} onChange={(e) => setModel(e.target.value)} style={selectStyle}>
            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
            <option value="gpt-4">gpt-4</option>
            <option value="gpt-4o-mini">gpt-4o-mini</option>
          </select>
        </div>

        <div style={chatContainerStyle}>
          {messages.map((msg, i) => (
            <div key={i} style={{ 
              marginBottom: '10px', 
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '70%',
              background: msg.role === 'user' ? '#fbc2eb' : '#a6c1ee',
              padding: '10px',
              borderRadius: '10px'
            }}>
              <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong> {msg.content}
            </div>
          ))}
          {loading && <div style={{ color: '#555', fontStyle: 'italic' }}>Assistant is typing...</div>}
        </div>

        <div style={inputContainerStyle}>
          <input
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            style={inputStyle}
          />
          <button onClick={sendMessage} className="button" style={sendButtonStyle}>
            ➜
          </button>
        </div>

        {statusMessage && <div style={{ marginTop: '10px', color: 'blue' }}>{statusMessage}</div>}
      </div>
    </div>
  );
}

export default App;

const outerContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  minHeight: '100vh',
  alignItems: 'center',
  padding: '20px',
  boxSizing: 'border-box'
};

const containerStyle = {
  width: '100%',
  maxWidth: '600px',
  background: '#fef9ff',
  borderRadius: '20px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  height: '80vh'
};

const headingStyle = {
  margin: '0 0 10px 0',
  color: '#222',
  fontWeight: '600',
  textAlign: 'center'
};

const paragraphStyle = {
  margin: '0 0 20px 0',
  color: '#333',
  fontSize: '14px',
  textAlign: 'center'
};

const modelSelectContainer = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px'
};

const labelStyle = {
  marginRight: '10px',
  fontSize: '14px',
  color: '#333'
};

const selectStyle = {
  flex: '1',
  padding: '8px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  background: '#fff',
  cursor: 'pointer',
  fontSize: '14px'
};

const chatContainerStyle = {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  marginBottom: '20px',
  background: '#ffffff77',
  padding: '10px',
  borderRadius: '10px'
};

const inputContainerStyle = {
  display: 'flex',
  alignItems: 'center'
};

const inputStyle = {
  flex: '1',
  padding: '10px',
  borderRadius: '20px',
  border: '1px solid #ddd',
  outline: 'none',
  marginRight: '10px',
  fontSize: '14px',
  background: '#fff'
};

const sendButtonStyle = {
  background: '#6ba9ec',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  fontSize: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};
