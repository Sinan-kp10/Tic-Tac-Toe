import "./App.css";
import Board from "./components/board";
import GameStatus from "./components/gameStatus";
import { useState } from "react";

function App() {

  const [board, setBoard] = useState([
    "", "", "",
    "", "", "",
    "", "", ""
  ])

  const [isX , setX] = useState(true)

  function calculateWinner(board) {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;

      if (board[a] && board[a] === board[b] && board[a] === board[c]){

        return board[a];
      }
    }

    return null;
  }

  const winner = calculateWinner(board)
  const isDraw = !winner && board.every((sq)=> sq !== "")



  function handleClick(index){

    if (winner || isDraw) return;


    if(board[index] !== "") return;

    const newBoard = [...board]

    if(isX){
      newBoard[index] = "x"
    }else {
      newBoard[index] = "O"
    }

    setBoard(newBoard)
    setX(!isX)
  }

  function restartGame(){
    setBoard([
      "", "", "",
      "", "", "",
      "", "", ""
    ]);

    setX(true);
  }

  return (
    <div className="container">
      <h1>Tic Tac Toe</h1>

      <GameStatus winner={winner} isDraw={isDraw}  isX={isX} />

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
      
      <button className="restart-btn" onClick={restartGame}>Restart Game </button>

    </div>
  );
}

export default App;