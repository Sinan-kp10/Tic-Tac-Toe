import { useState, useEffect } from "react";
import { generateSessionID } from "../utils/SessionGenerator";
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
  const [sessionID, setSessionID] = useState("");
  const [isHost, setIsHost] = useState("");
  const [player, setPlayer] = useState("");

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

  function createSession() {
    const newId = generateSessionID();
    setSessionID(newId);
    setPlayer("X");
    setIsHost("create-session");

    // Initialize session state in localStorage
    const sessionKey = `tictactoe_session_${newId}`;
    const initialSession = {
      board: Array(9).fill(""),
      isX: true,
      hostJoined: true,
      clientJoined: false
    };
    localStorage.setItem(sessionKey, JSON.stringify(initialSession));
  }

  function joinSession(enteredID) {
    if (!enteredID) return false;
    const sessionKey = `tictactoe_session_${enteredID}`;
    const dataStr = localStorage.getItem(sessionKey);
    if (!dataStr) return false;

    try {
      const data = JSON.parse(dataStr);
      data.clientJoined = true;
      localStorage.setItem(sessionKey, JSON.stringify(data));

      setSessionID(enteredID);
      setPlayer("O");
      setIsHost("client");
      setGameMode("two-players");
      return true;
    } catch (e) {
      console.error("Failed to join session:", e);
      return false;
    }
  }

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
    setBoard([
      "", "", "",
      "", "", "",
      "", "", ""
    ]);
    setX(true);
    setGameMode("");
    setDifficulty("");
    setSessionID("");
    setIsHost("");
    setPlayer("");
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
          if (isHost === "create-session" && data.clientJoined) {
            setIsHost("host");
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
  }, [gameMode, sessionID, isHost, board, isX]);

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
    createSession,
    joinSession,
    sessionID,
    setSessionID,
    isHost,
    setIsHost,
    player,
    setPlayer
  };
}
