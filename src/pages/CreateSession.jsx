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
        Back
      </button>
    </div>
  );
}

export default CreateSession;
