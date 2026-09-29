import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { joinSession } from "../firebase";

function JoinSession() {
  const navigate = useNavigate();
  const [enteredID, setEnteredID] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const trimmedId = enteredID.trim().toUpperCase();
      if (!trimmedId) {
        setError("Please enter a Room Code.");
        return;
      }

      setIsJoining(true);
      setError("");

      try {
        await joinSession(trimmedId);

        // Store in sessionStorage that this user is Player O (Visitor)
        sessionStorage.setItem(`tictactoe_player_${trimmedId}`, "O");

        navigate(`/game/multiplayer/${trimmedId}`);
      } catch (err) {
        console.error("Failed to join session:", err);
        setError(err.message || "Failed to join session. Please try again.");
      } finally {
        setIsJoining(false);
      }
    },
    [enteredID, navigate]
  );

  const handleInputChange = useCallback(
    (e) => {
      setEnteredID(e.target.value.toUpperCase());
      if (error) setError("");
    },
    [error]
  );

  return (
    <div className="session">
      <h1>Join Session</h1>
      <form onSubmit={handleSubmit} className="session-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter 6-digit Code (e.g. 7K9J2W)..."
            value={enteredID}
            onChange={handleInputChange}
            maxLength={10}
            className={error ? "input-error" : ""}
            autoFocus
          />
          {error && <span className="error-message">{error}</span>}
        </div>
        <button type="submit" className="join-btn" disabled={isJoining}>
          {isJoining ? "Joining..." : "Join Game"}
        </button>
        <button
          type="button"
          className="back-btn"
          onClick={() => {
            navigate("/multiplayer");
          }}
        >
          ← Back
        </button>
      </form>
    </div>
  );
}

export default JoinSession;
