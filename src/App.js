import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios"; 
import PhishingChecker from "./PhishingChecker.js"; 


function App() {
  // State for user input
  const [userInput, setUserInput] = useState("");
  
  // State for displaying backend analysis
  const [analysisResult, setAnalysisResult] = useState("");

  // Loading state for API request
  const [isLoading, setIsLoading] = useState(false);

  // Ref for the auto-resizing text area
  const textAreaRef = useRef(null);
  // Automatically resize the text area as user types
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; 
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }
  }, [userInput]);

  // Called when user clicks "Analyze"
  const handleAnalyze = () => {
    if (!userInput.trim()) {
      setAnalysisResult("Please enter text before analyzing.");
      return;
    }

    setIsLoading(true); // Show loading state
    setAnalysisResult(""); // Clear previous result

    axios
      .post("https://safenet-backend-eyhx.onrender.com/detect_phishing", { text: userInput }) // Sending text to Flask
      .then((response) => {
        setIsLoading(false);
        if (response.data.analysis) {
          setAnalysisResult(response.data.analysis);
        } else {
          setAnalysisResult("No analysis received.");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error connecting to backend:", error);
        setAnalysisResult(`Error: ${error.response?.data?.error || error.message}`);
      });
  };

  return (
    <div className="gradient-background">
      {}
      <div className="logo-placeholder">
        <img 
          src="/pngegg.png"
          className="logo-image"
        />
      </div>

      {/* Main Title & Subtitle */}
      <h1 className="main-title">SafeNet</h1>
      <p className="subtitle"> Safely analyze website URLs, email addresses, and text content for potential threats.</p>

      {/* Categories Section */}
      <div className="categories-container">
        <div className="category-card">
          <span className="category-icon">✉️</span>
          <h3>Emails</h3>
          <p>Analyze email addresses</p>
        </div>

        <div className="category-card">
          <span className="category-icon">🔗</span>
          <h3>URLs</h3>
          <p>Check website links</p>
        </div>

        <div className="category-card">
          <span className="category-icon">📝</span>
          <h3>Email Contents</h3>
          <p>Review suspicious text</p>
        </div>
      </div>

      {/* Auto-resizing Text Box */}
      <textarea
        ref={textAreaRef}
        className="auto-textarea"
        placeholder="Enter your text here..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />

      {/* Analyze Button */}
      <button className="analyze-button" onClick={handleAnalyze}>
        Analyze
      </button>

      {/* Result Display */}
      <div className="result-area">
        {analysisResult && <p>{analysisResult}</p>}
      </div>
    </div>
  );
}

export default App;
