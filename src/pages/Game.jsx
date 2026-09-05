import Board from "../components/Board";
import GameStatus from "../components/GameStatus";
import Fireworks from "../components/Fireworks";
import { useTicTacToe } from "../hooks/useTicTacToe";

function Game({ gameMode }) {
  const {
    board,
    isX,
    isPlaying,
    winner,
    winningLine,
    isDraw,
    handleClick,
    startGame,
    quitGame,
    restartGame,
    goToMenu,
    sessionID,
    player
  } = useTicTacToe(gameMode);

  return (
    <div className="container">
      <h1>Tic Tac Toe</h1>

      <GameStatus winner={winner} isDraw={isDraw} isX={isX} isPlaying={isPlaying} />

      {gameMode === "two-players" && sessionID && isPlaying && (
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

      {/* Fireworks celebration */}
      {winner && <Fireworks />}

      <Board board={board} handleClick={handleClick} winner={winner} winningLine={winningLine} />

      <div className="actions-container">
        {winner || isDraw ? (
          <>
            <button className="restart-btn" onClick={restartGame}>
              Restart Game
            </button>
            <button className="menu-btn" onClick={goToMenu}>
              Back
            </button>
          </>
        ) : isPlaying ? (
          <button className="quit-btn" onClick={quitGame}>
            Quit
          </button>
        ) : (
          <>
            <button className="play-btn" onClick={startGame}>
              <span className="play-icon">▶</span> Play Now
            </button>
            <button className="menu-btn" onClick={goToMenu}>
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Game;
