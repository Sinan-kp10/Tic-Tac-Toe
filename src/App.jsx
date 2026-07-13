import "./App.css";
import Board from "./components/board";
import GameStatus from "./components/gameStatus";
import GameMode from "./components/gameMode";
import Difficulty from "./components/difficulty";
import { useState, useEffect } from "react";

function App() {

  const [board, setBoard] = useState([
    "", "", "",
    "", "", "",
    "", "", ""
  ])



  const [isX , setX] = useState(true)

  const [gameMode, setGameMode] = useState("");
  const [difficulty, setDifficulty] = useState("");

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

    if (gameMode === "ai" && !isX) return;

    const newBoard = [...board]

    if(isX){
      newBoard[index] = "X"
    }else {
      newBoard[index] = "O"
    }

    setBoard(newBoard)
    setX(!isX)
  }

  function aiMove() {

    if (difficulty === "easy") {
      randomMove();
    }

    else if (difficulty === "medium") {
      mediumMove();
    }

    else if (difficulty === "hard") {
      minimaxMove();
    }

  }

  function randomMove() {

    const emptySquares = board
        .map((value, index) => value === "" ? index : null)
        .filter(index => index !== null);

    if (emptySquares.length === 0) return;

    const randomIndex =
        emptySquares[Math.floor(Math.random() * emptySquares.length)];

    const newBoard = [...board];

    newBoard[randomIndex] = "O";

    setBoard(newBoard);

    setX(true);

  }

  function mediumMove() {

    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    const newBoard = [...board];

    // AI tries to win
    for (const combination of winningCombinations) {

        const [a,b,c] = combination;

        const values = [newBoard[a], newBoard[b], newBoard[c]];

        if (
            values.filter(value => value === "O").length === 2 &&
            values.includes("")
        ) {

            const emptyIndex = combination[values.indexOf("")];

            newBoard[emptyIndex] = "O";

            setBoard(newBoard);

            setX(true);

            return;
        }
    }

    // Block player
    for (const combination of winningCombinations) {

        const [a,b,c] = combination;

        const values = [newBoard[a], newBoard[b], newBoard[c]];

        if (
            values.filter(value => value === "X").length === 2 &&
            values.includes("")
        ) {

            const emptyIndex = combination[values.indexOf("")];

            newBoard[emptyIndex] = "O";

            setBoard(newBoard);

            setX(true);

            return;
        }
    }

    // Otherwise random move
    randomMove();
}

function checkWinner(tempBoard) {

    const winningCombinations = [

        [0,1,2],
        [3,4,5],
        [6,7,8],

        [0,3,6],
        [1,4,7],
        [2,5,8],

        [0,4,8],
        [2,4,6]

    ];

    for (const combination of winningCombinations) {

        const [a,b,c] = combination;

        if (
            tempBoard[a] &&
            tempBoard[a] === tempBoard[b] &&
            tempBoard[a] === tempBoard[c]
        ) {

            return tempBoard[a];

        }

    }

    return null;

}

function minimax(tempBoard, isMaximizing) {

    const winner = checkWinner(tempBoard);

    if (winner === "O") return 10;

    if (winner === "X") return -10;

    if (!tempBoard.includes("")) return 0;

    if (isMaximizing) {

        let bestScore = -Infinity;

        for (let i = 0; i < 9; i++) {

            if (tempBoard[i] === "") {

                tempBoard[i] = "O";

                const score = minimax(tempBoard, false);

                tempBoard[i] = "";

                bestScore = Math.max(bestScore, score);

            }

        }

        return bestScore;

    } else {

        let bestScore = Infinity;

        for (let i = 0; i < 9; i++) {

            if (tempBoard[i] === "") {

                tempBoard[i] = "X";

                const score = minimax(tempBoard, true);

                tempBoard[i] = "";

                bestScore = Math.min(bestScore, score);

            }

        }

        return bestScore;

    }

}

function minimaxMove() {

    let bestScore = -Infinity;

    let bestMove = -1;

    const newBoard = [...board];

    for (let i = 0; i < 9; i++) {

        if (newBoard[i] === "") {

            newBoard[i] = "O";

            const score = minimax(newBoard, false);

            newBoard[i] = "";

            if (score > bestScore) {

                bestScore = score;

                bestMove = i;

            }

        }

    }

    if (bestMove !== -1) {

        newBoard[bestMove] = "O";

        setBoard(newBoard);

        setX(true);

    }

}
  

  function restartGame(){
    setBoard([
      "", "", "",
      "", "", "",
      "", "", ""
    ]);

    setX(true);
  }

  useEffect(() => {

    if (gameMode !== "ai") return;

    if (isX) return;

    if (winner) return;

    if (isDraw) return;

    const timer = setTimeout(() => {

      aiMove();

    }, 500);

    return () => clearTimeout(timer);

  }, [board, isX]);

  if (gameMode === "") {
    return <GameMode setGameMode={setGameMode} />
  }

  if (gameMode === "ai" && difficulty === "") {
    return <Difficulty setDifficulty={setDifficulty} />;
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