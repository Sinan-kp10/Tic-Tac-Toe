import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CreateSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (!sessionId) return;
    const sessionKey = `tictactoe_session_${sessionId}`;
    
    const checkClientJoined = () => {
      const dataStr = localStorage.getItem(sessionKey);
      if (dataStr) {
        try {
          const data = JSON.parse(dataStr);
          if (data.clientJoined) {
            // Client joined! Navigate to the game screen
            navigate(`/game/multiplayer/${sessionId}`);
          }
        } catch (e) {
          console.error("Error reading session status:", e);
        }
      }
    };

    // Initial check
    checkClientJoined();

    // Check periodically
    const interval = setInterval(checkClientJoined, 500);

    const handleStorageChange = (e) => {
      if (e.key === sessionKey) {
        checkClientJoined();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [sessionId, navigate]);

  return (
    <div className="session">
      <h1>Session Created</h1>
      <div className="session-card">
        <span className="session-label">Share this ID with Player 2:</span>
        <div className="session-id-display">{sessionId}</div>
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
          localStorage.removeItem(`tictactoe_session_${sessionId}`);
          sessionStorage.removeItem(`tictactoe_player_${sessionId}`);
          navigate("/multiplayer");
        }}
      >
        Cancel & Back
      </button>
    </div>
  );
}

function JoinSession() {
  const navigate = useNavigate();
  const [enteredID, setEnteredID] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedId = enteredID.trim();
    if (!trimmedId) {
      setError("Please enter a Session ID.");
      return;
    }

    const sessionKey = `tictactoe_session_${trimmedId}`;
    const dataStr = localStorage.getItem(sessionKey);
    if (!dataStr) {
      setError("Session ID not found. Ensure the host has created it.");
      return;
    }

    try {
      const data = JSON.parse(dataStr);
      data.clientJoined = true;
      localStorage.setItem(sessionKey, JSON.stringify(data));

      // Store in sessionStorage that this user is the visitor (player O)
      sessionStorage.setItem(`tictactoe_player_${trimmedId}`, "O");
      
      setError("");
      navigate(`/game/multiplayer/${trimmedId}`);
    } catch (err) {
      console.error("Failed to join session:", err);
      setError("Failed to join session. Please try again.");
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
            navigate("/multiplayer");
          }}
        >
          Back
        </button>
      </form>
    </div>
  );
}

export { CreateSession, JoinSession };