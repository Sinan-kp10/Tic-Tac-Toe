import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="menu">
      <h1>Tic Tac Toe</h1>

      <button onClick={() => navigate("/game/local")}>
        👥 Play Locally
      </button>

      <button onClick={() => navigate("/difficulty")}>
        🤖 Play Against AI
      </button>

      <button onClick={() => navigate("/multiplayer")}>
        👥 Play Two Players
      </button>
    </div>
  );
}

export default Home;
