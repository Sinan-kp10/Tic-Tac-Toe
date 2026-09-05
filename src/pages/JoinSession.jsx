import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

export default JoinSession;
