import { useState, useCallback, useEffect } from "react";
import "./App.css";

function App() {
  const [generatedString, setGeneratedString] = useState("");
  const [length, setLength] = useState(10);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);

  // Character sets for different types
  const characterSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  };

  // Generate random string using useCallback for performance
  const generateRandomString = useCallback(() => {
    setIsGenerating(true);

    // Build character pool based on selected options
    let characterPool = "";
    if (includeUppercase) characterPool += characterSets.uppercase;
    if (includeLowercase) characterPool += characterSets.lowercase;
    if (includeNumbers) characterPool += characterSets.numbers;
    if (includeSymbols) characterPool += characterSets.symbols;

    // If no character types are selected, use lowercase as default
    if (!characterPool) {
      characterPool = characterSets.lowercase;
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += characterPool.charAt(
        Math.floor(Math.random() * characterPool.length)
      );
    }

    // Simulate a small delay for better UX
    setTimeout(() => {
      setGeneratedString(result);
      setIsGenerating(false);
      setGenerationCount((prev) => prev + 1);
    }, 100);
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  ]);

  // Auto-generate on component mount and when dependencies change
  useEffect(() => {
    generateRandomString();
  }, [generateRandomString]);

  // Copy to clipboard function
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedString);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }, [generatedString]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔐 Random String Generator</h1>
        <p>Generate secure random strings with customizable options</p>
      </header>

      <main className="app-main">
        <div className="generator-container">
          <div className="controls-section">
            <div className="length-control">
              <label htmlFor="length">Length: {length}</label>
              <input
                id="length"
                type="range"
                min="1"
                max="100"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="length-slider"
              />
            </div>

            <div className="character-options">
              <h3>Character Types</h3>
              <div className="option-grid">
                <label className="option-item">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                  />
                  <span>Uppercase (A-Z)</span>
                </label>
                <label className="option-item">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                  />
                  <span>Lowercase (a-z)</span>
                </label>
                <label className="option-item">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                  />
                  <span>Numbers (0-9)</span>
                </label>
                <label className="option-item">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                  />
                  <span>Symbols (!@#$...)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="result-section">
            <div className="generated-string-container">
              <label>Generated String:</label>
              <div className="string-display">
                {isGenerating ? (
                  <div className="loading">Generating...</div>
                ) : (
                  <code className="generated-string">{generatedString}</code>
                )}
              </div>
              <div className="string-actions">
                <button
                  onClick={generateRandomString}
                  disabled={isGenerating}
                  className="generate-btn"
                >
                  {isGenerating ? "Generating..." : "Generate New"}
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={!generatedString || isGenerating}
                  className="copy-btn"
                >
                  📋 Copy
                </button>
              </div>
            </div>
          </div>

          <div className="stats-section">
            <div className="stat-item">
              <span className="stat-label">Generated:</span>
              <span className="stat-value">{generationCount} times</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Length:</span>
              <span className="stat-value">
                {generatedString.length} characters
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
