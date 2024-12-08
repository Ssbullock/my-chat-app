import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful assistant.' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const backendUrl = 'https://my-chat-app-1-0ktg.onrender.com';

  const register = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/register`, { username, password });
      setStatusMessage(res.data.message);
    } catch (error) {
      setStatusMessage(error.response?.data?.error || 'Registration failed');
    }
  };

  const login = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/login`, { username, password });
      setToken(res.data.token);
      setIsLoggedIn(true);
      setStatusMessage('Logged in successfully!');
    } catch (error) {
      setStatusMessage(error.response?.data?.error || 'Login failed');
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    const newMessages = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);
    setUserInput('');
    
    try {
      const res = await axios.post(`${backendUrl}/api/chat`, { messages: newMessages }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const assistantReply = res.data.reply;
      setMessages([...newMessages, { role: 'assistant', content: assistantReply }]);
    } catch (error) {
      console.error(error);
      setStatusMessage('Error sending message');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>My ChatGPT Clone</h1>
      {!isLoggedIn ? (
        <div style={{ marginBottom: '20px' }}>
          <h2>Register or Login</h2>
          <input 
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
          />
          <input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
          />
          <button onClick={register} style={{ marginRight: '10px' }}>Register</button>
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <>
          <h2>Chat</h2>
          <div style={{
            border: '1px solid #ccc',
            padding: '10px',
            height: '300px',
            overflowY: 'auto',
            marginBottom: '10px'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <strong>{msg.role === 'user' ? 'You' : msg.role === 'assistant' ? 'Assistant' : 'System'}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <input
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            style={{ width: '80%', padding: '8px', marginRight: '10px' }}
          />
          <button onClick={sendMessage}>Send</button>
        </>
      )}
      {statusMessage && <div style={{ marginTop: '10px', color: 'blue' }}>{statusMessage}</div>}
    </div>
  );
}

export default App;
