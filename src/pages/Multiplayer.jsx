import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { generateSessionId, createSession } from "../firebase";

function Multiplayer() {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreateRoom = useCallback(async () => {
    try {
      setCreating(true);
      setError("");
      const newSessionId = generateSessionId();

      // Store in sessionStorage that the creator is player X (Host)
      sessionStorage.setItem(`tictactoe_player_${newSessionId}`, "X");

      // Initialize the session doc in Firebase Firestore
      await createSession(newSessionId);

      // Navigate to the waiting lobby
      navigate(`/multiplayer/create/${newSessionId}`);
    } catch (err) {
      console.error("Failed to create multiplayer room:", err);
      setError(err.message || "Failed to create room. Please try again.");
    } finally {
      setCreating(false);
    }
  }, [navigate]);

  const handleJoinRoom = useCallback(() => {
    navigate("/multiplayer/join");
  }, [navigate]);

  return (
    <div className="menu">
      <h1>Online Multiplayer</h1>

      <div className="session-card" style={{ maxWidth: "440px", width: "90%" }}>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "15px",
            lineHeight: "1.6",
            margin: "0 0 10px 0",
            textAlign: "center",
          }}
        >
          Play real-time Tic Tac Toe with a friend anywhere in the world!
        </p>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "13px",
              color: "#fca5a5",
              lineHeight: "1.5",
              textAlign: "left",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <button
          className="join-btn"
          onClick={handleCreateRoom}
          disabled={creating}
          style={{ opacity: creating ? 0.7 : 1 }}
        >
          {creating ? "Creating Room..." : "✨ Create New Room"}
        </button>

        <button className="copy-btn" onClick={handleJoinRoom}>
          🔑 Join with Code
        </button>
      </div>

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>
    </div>
  );
}

export default Multiplayer;
