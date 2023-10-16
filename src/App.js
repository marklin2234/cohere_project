import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import userAvatar from './img/anon.png'
import chatAvatar from './img/bot.png'

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
  const [isProcessing, setIsProcessing] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatHistory]);

  useEffect(() => {
    const welcomeMessage = {
      user: 'Chatbot',
      message: 'Welcome! Enter your text below and click the submit button or toggle link functionality.',
      isBot: true,
    };
    setChatHistory([welcomeMessage]);
  }, []);


  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInput.trim() === '') {
      return;
    }

    setIsProcessing(true); // the bot now says "Working on it!"
    if (userInput.trim() !== '') {
      const summary = await getSummary(userInput);
      // First update the user input
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { message: userInput, isBot: false, },
      ]);

      // then update with the reply
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { message: summary, isBot: true, },
      ]);

      setUserInput('');
    }
    setIsProcessing(false);
  };

  function handleLinkToggle() {
    // Go from text to link mode
    if (appState === AppStates.TextMode) {
      setAppState(AppStates.LinkMode);
    } else { // Go from link mode to text mode
      setAppState(AppStates.TextMode);
    }
  };

  const getSummaryFromLink = async(input) => {
    // request setup
    const params = { link: input };
    const endpoint = FLASK_SERVER_URL + "/get"; 
    const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');

    // Make the request to the flask backend. This is because Flask acts as proxy for the CORS problem.
    var summary = "";
    try {
      const response = await fetch(`${endpoint}?${queryString}`);
      const data = await response.json();
      summary = data.summary;
      console.log(summary);
    } catch (error) {
      console.log("Error in link fetch: " + error);
      return "Woops. That didn't work. Can you check all the configurations are correct?";
    }
    
    return summary
  }

  const getSummary = async (text) => {
    if (appState === AppStates.LinkMode) {
      return getSummaryFromLink(text);
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

      if (!data.summary) {
        return "Woops. That didn't work. Can you check all the configurations are correct?";
      }

      return data.summary;

    } catch (error) {
      console.log('Error occurred during API request:', error);
      return "Woops. That didn't work. Can you check all the configurations are correct?";
    }
  };

  return (
    <div className="mini-browser">
      <div className="chat-header">
        <h1>TLDR Chatbot</h1>
      </div>
      <div className="chat-container" ref={chatContainerRef}>
        {chatHistory.map((chat, index) => (
          <div key={index}>
            {chat.isBot ? (
              <div className="chatbot-message">
                <img src={chatAvatar} alt="Chatbot Avatar" className="avatar-bot" />
                <p className="message-content-bot">{chat.message}</p>
              </div>
            ) : (
              <div className="user-message">
                <img src={userAvatar} alt="User Avatar" className="avatar-user" />
                <p className="message-content">{chat.message}</p>
              </div>
            )}
          </div>
        ))}
        {isProcessing && (
          <div className="chatbot-message">
            <img src={chatAvatar} alt="Chatbot Avatar" className="avatar-bot" />
            <p className="message-content-bot">Working on it!</p>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div class="chat-input">
          <textarea
            type="text"
            value={userInput}
            onChange={handleUserInput}
            placeholder={appState === AppStates.LinkMode ? "Paste your link here..." : "Type your passage..."}
            id="input-text-field"
            className={appState === AppStates.LinkMode ? 'link-mode' : ''}
          />
        </div>
        <button type="submit">Send</button>
        <button id="toggle-links" onClick={handleLinkToggle}>Toggle Pasted Links</button>
      </form>
    </div>
  );
}

export default App;
