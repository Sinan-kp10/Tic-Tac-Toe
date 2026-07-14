import { useState } from "react";

function CreateSession({ sessionID, setSessionID, setIsHost }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="session">
      <h1>Session Created</h1>
      <div className="session-card">
        <span className="session-label">Share this ID with Player 2:</span>
        <div className="session-id-display">{sessionID}</div>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? "✓ Copied!" : "📋 Copy Session ID"}
        </button>
      </div>

      <div className="waiting-container">
        <div className="pulse-loader"></div>
        <span className="waiting-text">Waiting for Player 2 to join...</span>
      </div>

      <button
        className="back-btn"
        onClick={() => {
          localStorage.removeItem(`tictactoe_session_${sessionID}`);
          setSessionID("");
          setIsHost("");
        }}
      >
        Cancel & Back
      </button>
    </div>
  );
}

function JoinSession({ setIsHost, joinSession }) {
  const [enteredID, setEnteredID] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!enteredID || !enteredID.trim()) {
      setError("Please enter a Session ID.");
      return;
    }

    const success = joinSession(enteredID.trim());
    if (!success) {
      setError("Session ID not found. Ensure the host has created it.");
    } else {
      setError("");
    }
  };

  return (
    <div className="session">
      <h1>Join Session</h1>
      <form onSubmit={handleSubmit} className="session-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter Session ID..."
            value={enteredID}
            onChange={(e) => {
              setEnteredID(e.target.value);
              if (error) setError("");
            }}
            className={error ? "input-error" : ""}
          />
          {error && <span className="error-message">{error}</span>}
        </div>
        <button type="submit" className="join-btn">
          Join Game
        </button>
        <button
          type="button"
          className="back-btn"
          onClick={() => {
            setIsHost("");
          }}
        >
          Back
        </button>
      </form>
    </div>
  );
}

export { CreateSession, JoinSession };