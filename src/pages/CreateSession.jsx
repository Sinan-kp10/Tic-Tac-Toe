import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { subscribeSession, leaveSession } from "../firebase";

function CreateSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = useCallback(() => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  }, [sessionId]);

  const handleCopyLink = useCallback(() => {
    if (sessionId) {
      const shareUrl = `${window.location.origin}/game/multiplayer/${sessionId}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }, [sessionId]);

  // Real-time Firestore subscription to detect when Player 2 joins
  useEffect(() => {
    if (!sessionId) return;

    const unsubscribe = subscribeSession(
      sessionId,
      (data) => {
        if (data && data.clientJoined) {
          // Client has joined! Automatically navigate host to the game screen
          navigate(`/game/multiplayer/${sessionId}`);
        }
      },
      (err) => {
        console.error("Session listener error:", err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [sessionId, navigate]);

  const handleCancel = useCallback(async () => {
    if (sessionId) {
      sessionStorage.removeItem(`tictactoe_player_${sessionId}`);
      await leaveSession(sessionId);
    }
    navigate("/multiplayer");
  }, [sessionId, navigate]);

  return (
    <div className="session">
      <h1>Session Created</h1>
      <div className="session-card">
        <span className="session-label">Share this Room Code with Player 2:</span>
        <div className="session-id-display">{sessionId}</div>

        <button className="copy-btn" onClick={handleCopyCode}>
          {copiedCode ? "✓ Code Copied!" : "📋 Copy Room Code"}
        </button>

        <button
          className="copy-btn"
          onClick={handleCopyLink}
          style={{ background: "transparent", border: "1px solid var(--btn-primary-bg)", color: "var(--color-x)" }}
        >
          {copiedLink ? "✓ Link Copied!" : "🔗 Copy Direct Link"}
        </button>
      </div>

      <div className="waiting-container">
        <div className="pulse-loader"></div>
        <span className="waiting-text">Waiting for Player 2 to join...</span>
      </div>

      <button className="back-btn" onClick={handleCancel}>
        ← Cancel & Back
      </button>
    </div>
  );
}

export default CreateSession;
