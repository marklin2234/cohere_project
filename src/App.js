import React, { useState } from 'react';
import './App.css';

const FLASK_SERVER_URL = 'http://localhost:5000'

const COHERE_API_ENDPOINT = 'https://api.cohere.ai/v1/summarize';
const API_KEY = '0R0GpKWYjaWulTrHEf48MCAkB59AYjZLdHczD21g';

function App() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const AppStates = {
    TextMode: 0,
    LinkMode: 1
  }
  const [appState, setAppState] = useState(AppStates.TextMode);

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

  function handleLinkToggle() {
    // Go from text to link mode
    if (appState === AppStates.TextMode) {
      document.getElementById("input-text-field").placeholder = "Paste your link here...";
      setAppState(AppStates.LinkMode);
    } else { // Go from link mode to text mode
      document.getElementById("input-text-field").placeholder = "Type your passage...";
      setAppState(AppStates.TextMode);
    }
  };

  const fetchFromLink = async(input) => {
    // request setup
    const params = { link: input };
    const endpoint = FLASK_SERVER_URL + "/get"; 
    const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');

    // Make the request to the flask backend
    var summary = "";
    try {
      const response = await fetch(`${endpoint}?${queryString}`);
      const data = await response.json();
      summary = data.summary;
      console.log(summary);
    } catch (error) {
      console.log("Error in link fetch: " + error);
      return input;
    }
    
    return summary
  }

  const getSummary = async (text) => {
    if (appState === AppStates.LinkMode) {
      return fetchFromLink(text)
    }
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
      <h1>TLDR Chatbot</h1>
      <div className="chat-container">
        {chatHistory.map((chat, index) => (
          <div key={index}>
            <p className="user-message">You: <br></br>{chat.user}</p>
            <p className="chatbot-message">
              The summary of your passage is: <br></br>{chat.summary}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div class="chat-input">
          <textarea
            type="text"
            value={userInput}
            onChange={handleUserInput}
            placeholder="Type your passage..."
            id="input-text-field"
          />
        </div>
        <button type="submit">Send</button>
        <button id="toggle-links" onClick={handleLinkToggle}>Toggle Pasted Links</button>
      </form>
    </div>
  );
}

export default App;
