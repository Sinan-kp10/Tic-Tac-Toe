import { useParams } from "react-router-dom";
import Board from "../components/Board";
import GameStatus from "../components/GameStatus";
import ScoreBoard from "../components/ScoreBoard";
import Fireworks from "../components/Fireworks";
import PlayModal from "../components/PlayModal";
import { useTicTacToe } from "../hooks/useTicTacToe";

function Game({ gameMode }) {
  const { difficulty } = useParams();
  const {
    board,
    isX,
    isPlaying,
    winner,
    winningLine,
    isDraw,
    scores,
    resetScores,
    handleClick,
    startGame,
    quitGame,
    playAgain,
    goToMenu,
    sessionID,
    player
  } = useTicTacToe(gameMode);

  const showPlayModal = !isPlaying && !winner && !isDraw;

  return (
    <div className="container game-container">
      {/* Fireworks celebration */}
      {winner && <Fireworks />}

      <div className="game-layout">
        {/* Left Side (Info, Scores & Controls) */}
        <div className="game-info-side">
          <h1 className="game-title">Tic Tac Toe</h1>

          <ScoreBoard
            scores={scores}
            gameMode={gameMode}
            difficulty={difficulty}
            player={player}
            isX={isX}
            isPlaying={isPlaying}
            winner={winner}
            isDraw={isDraw}
            onResetScores={resetScores}
          />

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

          <div className="actions-container">
            {winner || isDraw ? (
              <>
                <button className="play-again-btn" onClick={playAgain}>
                  Play Again
                </button>
                <button className="menu-btn" onClick={goToMenu}>
                  Back
                </button>
              </>
            ) : isPlaying ? (
              <button className="quit-btn" onClick={quitGame}>
                Quit
              </button>
            ) : null}
          </div>
        </div>

        {/* Right Side (Game Board) */}
        <div className="game-board-side">
          <Board board={board} handleClick={handleClick} winner={winner} winningLine={winningLine} />
        </div>
      </div>

      {/* Play Popup Modal with Play and Back buttons */}
      <PlayModal
        isOpen={showPlayModal}
        onPlay={startGame}
        onBack={goToMenu}
        gameMode={gameMode}
        difficulty={difficulty}
      />
    </div>
  );
}

export default Game;
