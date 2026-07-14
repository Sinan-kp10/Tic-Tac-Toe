function GameMode({ setGameMode }) {
  return (
    <div className="menu">
      <h1>Tic Tac Toe</h1>

      <button onClick={() => setGameMode("local")}>
        👥 Play Locally
      </button>

      <button onClick={() => setGameMode("ai")}>
        🤖 Play Against AI
      </button>

      <button onClick={() => setGameMode("two-players")}>
        👥 Play Two Players
      </button>
    </div>
  );
}

export default GameMode;