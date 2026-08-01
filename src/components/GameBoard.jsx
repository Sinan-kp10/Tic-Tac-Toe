import Board from "./Board";
import GameStatus from "./GameStatus";
import { useTicTacToe } from "../hooks/useTicTacToe";

function GameBoard({ gameMode }) {
  const {
    board,
    isX,
    winner,
    winningLine,
    isDraw,
    handleClick,
    restartGame,
    goToMenu,
    sessionID,
    player
  } = useTicTacToe(gameMode);

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

export default GameBoard;
