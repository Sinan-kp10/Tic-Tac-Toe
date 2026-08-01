import { useNavigate } from "react-router-dom";

function Difficulty() {
  const navigate = useNavigate();

  return (
    <div className="menu">
      <h1>Select Difficulty</h1>

      <button onClick={() => navigate("/game/ai/easy")}>
        🟢 Easy
      </button>

      <button onClick={() => navigate("/game/ai/medium")}>
        🟡 Medium
      </button>

      <button onClick={() => navigate("/game/ai/hard")}>
        🔴 Hard
      </button>

      <button className="back-btn" style={{ marginTop: "1rem" }} onClick={() => navigate("/")}>
        Back
      </button>
    </div>
  );
}

export default Difficulty;