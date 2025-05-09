import React, { useState, useRef, useEffect } from 'react';

function App() {
  const [paragraph, setParagraph] = useState('');
  const [sentences, setSentences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCursor, setShowCursor] = useState(true);
  const terminalRef = useRef(null);

  // Auto-scroll to the bottom when sentences are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [sentences]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paragraph.trim()) {
      setError('Please enter a paragraph');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSentences([]);
    
    try {
      const response = await fetch('http://localhost:8000/process-paragraph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paragraph }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process paragraph');
      }
      
      // Create a reader from the response body stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // Process the stream
      while (true) {
        const { value, done } = await reader.read();
        
        if (done) {
          break;
        }
        
        // Decode the chunk and split by newlines
        const chunk = decoder.decode(value);
        const newSentences = chunk.split('\n').filter(s => s.trim());
        
        // Update state with new sentences
        setSentences(prev => [...prev, ...newSentences]);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Paragraph Processor</h1>
      <p className="description">
        Enter a paragraph and watch it stream back sentence by sentence in a terminal-like interface
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="paragraph">Enter your paragraph:</label>
          <textarea
            id="paragraph"
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
            placeholder="Type or paste your paragraph here..."
            rows={5}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className={isLoading ? 'loading' : ''}
        >
          {isLoading ? 'Processing...' : 'Process Paragraph'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      
      {(sentences.length > 0 || isLoading) && (
        <div className="results">
          <h2>Terminal Output</h2>
          <div className="sentences-container" ref={terminalRef}>
            {sentences.map((sentence, index) => (
              <React.Fragment key={index}>
                {index > 0 && <br />}
                <span className="sentence">{sentence}</span>
              </React.Fragment>
            ))}
            {isLoading && <span className="terminal-cursor"></span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;