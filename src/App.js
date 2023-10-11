import React, { useState } from 'react';
import './App.css';

const COHERE_API_ENDPOINT = 'https://api.cohere.ai/v1/summarize';
const API_KEY = '0R0GpKWYjaWulTrHEf48MCAkB59AYjZLdHczD21g';

function App() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInput.trim() !== '') {
      const summary = await getSummary(userInput);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { user: userInput, summary },
      ]);
      setUserInput('');
    }
  };

  const getSummary = async (text) => {
    const payload = { text };
    const headers = {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(COHERE_API_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data.summary;
    } catch (error) {
      console.log('Error occurred during API request:', error);
      return null;
    }
  };

  return (
    <div className="container">
      <h1>Summary Chatbot</h1>
      <div className="chat-container">
        {chatHistory.map((chat, index) => (
          <div key={index}>
            <p className="user-message">You: {chat.user}</p>
            <p className="chatbot-message">
              Chatbot: The summary of your passage is: <br></br>{chat.summary}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          type="text"
          value={userInput}
          onChange={handleUserInput}
          placeholder="Type your passage..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
