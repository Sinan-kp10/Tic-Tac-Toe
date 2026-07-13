import { useState, useEffect } from "react";
import {
  calculateWinner,
  getEasyMove,
  getMediumMove,
  getHardMove,
  getWinningLine,
} from "../utils/gameLogic";

export function useTicTacToe() {
  const [board, setBoard] = useState([
    "", "", "",
    "", "", "",
    "", "", ""
  ]);

  const [isX, setX] = useState(true);
  const [gameMode, setGameMode] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const winner = calculateWinner(board);
  const winningLine = getWinningLine(board);
  const isDraw = !winner && board.every((sq) => sq !== "");

  function handleClick(index) {
    if (winner || isDraw) return;
    if (board[index] !== "") return;
    if (gameMode === "ai" && !isX) return;

    const newBoard = [...board];
    newBoard[index] = isX ? "X" : "O";

    setBoard(newBoard);
    setX(!isX);
  }

  function aiMove() {
    let moveIndex = -1;

    if (difficulty === "easy") {
      moveIndex = getEasyMove(board);
    } else if (difficulty === "medium") {
      moveIndex = getMediumMove(board);
    } else if (difficulty === "hard") {
      moveIndex = getHardMove(board);
    }

    if (moveIndex !== -1) {
      const newBoard = [...board];
      newBoard[moveIndex] = "O";
      setBoard(newBoard);
      setX(true);
    }
  }

  function restartGame() {
    setBoard([
      "", "", "",
      "", "", "",
      "", "", ""
    ]);
    setX(true);
  }

  function goToMenu() {
    setBoard([
      "", "", "",
      "", "", "",
      "", "", ""
    ]);
    setX(true);
    setGameMode("");
    setDifficulty("");
  }

  // Trigger AI move when it's AI's turn
  useEffect(() => {
    if (gameMode !== "ai") return;
    if (isX) return;
    if (winner) return;
    if (isDraw) return;

    const timer = setTimeout(() => {
      aiMove();
    }, 500);

    return () => clearTimeout(timer);
  }, [board, isX, gameMode, difficulty, winner, isDraw]);

  return {
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
  };
}
