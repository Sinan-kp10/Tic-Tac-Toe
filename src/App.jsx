import "./App.css";
import Board from "./components/Board";
import GameStatus from "./components/GameStatus";
import GameMode from "./components/GameMode";
import Difficulty from "./components/Difficulty";
import { useTicTacToe } from "./hooks/useTicTacToe";
import PlayTwoPlayers from "./components/play-two-players";
import { CreateSession, JoinSession } from "./components/Session";

function App() {
  const {
    board,
    isX,
    gameMode,
    setGameMode,
    difficulty,
    setDifficulty,
    winner,
    winningLine,
    isDraw,
    handleClick,
    restartGame,
    goToMenu,
    createSession,
    joinSession,
    isHost,
    setIsHost,
    sessionID,
    setSessionID,
    player
  } = useTicTacToe();

  if (gameMode === "") {
    return <GameMode setGameMode={setGameMode} />;
  }

  if (gameMode === "ai" && difficulty === "") {
    return <Difficulty setDifficulty={setDifficulty} />;
  }

  if (isHost === "create-session") {
    return <CreateSession sessionID={sessionID} setSessionID={setSessionID} setIsHost={setIsHost} />;
  }

  if (isHost === "join-session") {
    return <JoinSession setIsHost={setIsHost} joinSession={joinSession} />;
  }

  if (gameMode === "two-players" && (isHost === "" || isHost === "join-session")) {
    return <PlayTwoPlayers setGameMode={setGameMode} setIsHost={setIsHost} createSession={createSession} />;
  }

  return (
    <div className="container">
      <h1>Tic Tac Toe</h1>

      <GameStatus winner={winner} isDraw={isDraw} isX={isX} />

      {gameMode === "two-players" && sessionID && (
        <div className="role-indicator">
          Playing as: <span className={player === "X" ? "player-x-label" : "player-o-label"}>{player}</span>
          {player === "X" ? " (Host)" : " (Visitor)"}
          <div className="turn-status">
            {winner || isDraw ? (
              <span className="game-over-badge">🎮 Game Over</span>
            ) : (isX && player === "X") || (!isX && player === "O") ? (
              <span className="your-turn-badge pulse-badge">👉 Your Turn</span>
            ) : (
              <span className="opponent-turn-badge">⌛ Opponent's Turn</span>
            )}
          </div>
        </div>
      )}

      {/* Fireworks */}
      {winner && (
        <div className="fireworks">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      <Board board={board} handleClick={handleClick} winner={winner} winningLine={winningLine} />

      {winner || isDraw ? (
        <div className="actions-container">
          <button className="restart-btn" onClick={restartGame}>
            Restart Game
          </button>
          <button className="menu-btn" onClick={goToMenu}>
            Menu
          </button>
        </div>
      ) : (
        <button className="restart-btn" onClick={restartGame}>
          Restart Game
        </button>
      )}
    </div>
  );
}

export default App;