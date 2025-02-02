import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function PhishingChecker() {
  // Input and result states
  const [inputText, setInputText] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // For auto-resizing text area
  const textAreaRef = useRef(null);
  
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }
  }, [inputText]);

  const handleAnalyze = () => {
    setIsLoading(true);
    setAnalysisResult("");
    axios
      .post("https://safenet-backend-eyhx.onrender.com/detect_phishing", { text: inputText })
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
        setAnalysisResult(`Error: ${error.message}`);
      });
  };

  return (
    <div className="phish-container">
      <h1 className="jelly-logo">SafeNet</h1>
      <p className="subtitle">Safely analyze website URLs, email addresses, and text content for potential threats.</p>

      {/* Static Category Cards */}
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

      {/* Auto-resizing text area */}
      <div className="textarea-wrapper">
        <textarea
          ref={textAreaRef}
          className="auto-textarea"
          placeholder="Enter your text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>

      {/* Analyze Button */}
      <button className="analyze-button" onClick={handleAnalyze}>
        Analyze
      </button>

      {/* Spinner if loading */}
      {isLoading && <div className="spinner"></div>}

      {/* Result area */}
      <div className="result-area">
        {analysisResult && <pre>{analysisResult}</pre>}
      </div>
    </div>
  );
}

export default PhishingChecker;
