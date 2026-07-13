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
    isDraw,
    handleClick,
    restartGame,
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

      <Board board={board} handleClick={handleClick} />

      <button className="restart-btn" onClick={restartGame}>
        Restart Game
      </button>
    </div>
  );
}

export default App;