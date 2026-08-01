import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  calculateWinner,
  getEasyMove,
  getMediumMove,
  getHardMove,
  getWinningLine,
} from "../utils/gameLogic";

export function useTicTacToe(gameMode) {
  const { difficulty, sessionId: sessionID } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState([
    "", "", "",
    "", "", "",
    "", "", ""
  ]);

  const [isX, setX] = useState(true);
  
  const player = gameMode === "two-players" && sessionID
    ? sessionStorage.getItem(`tictactoe_player_${sessionID}`) || ""
    : "";

  const winner = calculateWinner(board);
  const winningLine = getWinningLine(board);
  const isDraw = !winner && board.every((sq) => sq !== "");

  function handleClick(index) {
    if (winner || isDraw) return;
    if (board[index] !== "") return;
    if (gameMode === "ai" && !isX) return;

    // In two-players multiplayer mode, restrict moves to the active player's turn
    if (gameMode === "two-players" && sessionID) {
      if (isX && player !== "X") return;
      if (!isX && player !== "O") return;
    }

    const newBoard = [...board];
    newBoard[index] = isX ? "X" : "O";

    const nextIsX = !isX;
    setBoard(newBoard);
    setX(nextIsX);

    // If it's a multiplayer session, update localStorage
    if (gameMode === "two-players" && sessionID) {
      const sessionKey = `tictactoe_session_${sessionID}`;
      const sessionData = JSON.parse(localStorage.getItem(sessionKey)) || {};
      const updatedData = {
        ...sessionData,
        board: newBoard,
        isX: nextIsX
      };
      localStorage.setItem(sessionKey, JSON.stringify(updatedData));
    }
  }

  const aiMove = useCallback(() => {
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
  }, [board, difficulty]);

  function restartGame() {
    const emptyBoard = [
      "", "", "",
      "", "", "",
      "", "", ""
    ];
    setBoard(emptyBoard);
    setX(true);

    if (gameMode === "two-players" && sessionID) {
      const sessionKey = `tictactoe_session_${sessionID}`;
      const sessionData = JSON.parse(localStorage.getItem(sessionKey)) || {};
      const updatedData = {
        ...sessionData,
        board: emptyBoard,
        isX: true
      };
      localStorage.setItem(sessionKey, JSON.stringify(updatedData));
    }
  }

  function goToMenu() {
    navigate("/");
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
  }, [board, isX, gameMode, difficulty, winner, isDraw, aiMove]);

  // Sync logic for Two-Players session
  useEffect(() => {
    if (gameMode !== "two-players" || !sessionID) return;

    const sessionKey = `tictactoe_session_${sessionID}`;

    const syncFromStorage = () => {
      const dataStr = localStorage.getItem(sessionKey);
      if (dataStr) {
        try {
          const data = JSON.parse(dataStr);
          if (data.board) {
            // Only update local board if different
            if (JSON.stringify(data.board) !== JSON.stringify(board)) {
              setBoard(data.board);
            }
          }
          if (data.isX !== undefined && data.isX !== isX) {
            setX(data.isX);
          }
        } catch (e) {
          console.error("Error parsing session data", e);
        }
      }
    };

    // Initial sync
    syncFromStorage();

    const handleStorageChange = (e) => {
      if (e.key === sessionKey) {
        syncFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(syncFromStorage, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [gameMode, sessionID, board, isX]);

  return {
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
  };
}
