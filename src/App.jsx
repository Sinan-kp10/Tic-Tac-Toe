import "./App.css";
import Board from "./components/Board";
import GameStatus from "./components/GameStatus";
import GameMode from "./components/GameMode";
import Difficulty from "./components/Difficulty";
import { useTicTacToe } from "./hooks/useTicTacToe";

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
  } = useTicTacToe();

  if (gameMode === "") {
    return <GameMode setGameMode={setGameMode} />;
  }

  if (gameMode === "ai" && difficulty === "") {
    return <Difficulty setDifficulty={setDifficulty} />;
  }

  return (
    <div className="container">
      <h1>Tic Tac Toe</h1>

      <GameStatus winner={winner} isDraw={isDraw} isX={isX} />

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