import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  calculateWinner,
  getEasyMove,
  getMediumMove,
  getHardMove,
  getWinningLine,
} from "../utils/gameLogic";
import {
  subscribeSession,
  updateMove,
  updateScores,
  restartGame,
  resetSessionScores,
  leaveSession,
  joinSession,
} from "../firebase";

const EMPTY_BOARD = ["", "", "", "", "", "", "", "", ""];

export function useTicTacToe(gameMode) {
  const { difficulty, sessionId: sessionID } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(EMPTY_BOARD);
  const [isX, setX] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scores, setScores] = useState({ x: 0, o: 0, ties: 0 });
  const [round, setRound] = useState(1);
  const [playerRole, setPlayerRole] = useState(() => {
    if (gameMode === "two-players" && sessionID) {
      return sessionStorage.getItem(`tictactoe_player_${sessionID}`) || "";
    }
    return "";
  });
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  const scoredRoundRef = useRef(0);

  // Derived state memoized for high performance
  const winner = useMemo(() => calculateWinner(board), [board]);
  const winningLine = useMemo(() => getWinningLine(board), [board]);
  const isDraw = useMemo(
    () => !winner && board.every((sq) => sq !== ""),
    [winner, board]
  );

  // Auto-join direct link visitors as Player O if role is not set yet
  useEffect(() => {
    if (gameMode !== "two-players" || !sessionID) return;

    const existingRole = sessionStorage.getItem(`tictactoe_player_${sessionID}`);
    if (!existingRole) {
      joinSession(sessionID)
        .then(() => {
          sessionStorage.setItem(`tictactoe_player_${sessionID}`, "O");
          setPlayerRole("O");
        })
        .catch((err) => {
          console.error("Direct join error:", err);
        });
    } else {
      setPlayerRole(existingRole);
    }
  }, [gameMode, sessionID]);

  // Real-time synchronization for Firebase Two-Players session
  useEffect(() => {
    if (gameMode !== "two-players" || !sessionID) return;

    const unsubscribe = subscribeSession(
      sessionID,
      (data) => {
        if (!data) {
          // Document was removed or room was closed
          setOpponentDisconnected(true);
          return;
        }

        if (data.board) {
          setBoard((prev) => {
            const hasChanged = prev.some((val, idx) => val !== data.board[idx]);
            return hasChanged ? data.board : prev;
          });
        }

        if (typeof data.isX === "boolean") {
          setX(data.isX);
        }

        if (data.scores) {
          setScores(data.scores);
        }

        if (data.round) {
          setRound(data.round);
        }

        if (data.scoredRound) {
          scoredRoundRef.current = data.scoredRound;
        }

        if (data.status === "playing" || data.clientJoined) {
          setIsPlaying(true);
        }
      },
      (err) => {
        console.error("Error in Firebase subscription:", err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [gameMode, sessionID]);

  // Update scores when a win or draw occurs
  useEffect(() => {
    if (!isPlaying) return;
    if (!winner && !isDraw) return;
    if (scoredRoundRef.current === round) return;

    scoredRoundRef.current = round;

    if (gameMode === "two-players" && sessionID) {
      // In multiplayer, the host (Player X) or winning player updates the authoritative score in Firestore
      // To avoid duplicate score increments from both peers simultaneously, player X updates it
      const shouldUpdateFirestore = playerRole === "X" || (winner === playerRole);

      if (shouldUpdateFirestore) {
        const nextScores = {
          x: winner === "X" ? scores.x + 1 : scores.x,
          o: winner === "O" ? scores.o + 1 : scores.o,
          ties: isDraw ? scores.ties + 1 : scores.ties,
        };
        updateScores(sessionID, nextScores, round).catch((err) => {
          console.error("Failed to update scores in Firestore:", err);
        });
      }
    } else {
      // Local or AI mode
      setScores((prev) => ({
        x: winner === "X" ? prev.x + 1 : prev.x,
        o: winner === "O" ? prev.o + 1 : prev.o,
        ties: isDraw ? prev.ties + 1 : prev.ties,
      }));
    }
  }, [isPlaying, winner, isDraw, round, gameMode, sessionID, scores, playerRole]);

  // Start / initialize game
  const startGame = useCallback(() => {
    setBoard(EMPTY_BOARD);
    setX(true);
    setIsPlaying(true);
    setRound(1);
    scoredRoundRef.current = 0;

    if (gameMode === "two-players" && sessionID) {
      restartGame(sessionID, 1).catch((err) => {
        console.error("Failed to start Firebase session:", err);
      });
    }
  }, [gameMode, sessionID]);

  // Quit game and clean up session
  const quitGame = useCallback(async () => {
    setIsPlaying(false);
    setBoard(EMPTY_BOARD);
    setX(true);

    if (gameMode === "two-players" && sessionID) {
      sessionStorage.removeItem(`tictactoe_player_${sessionID}`);
      await leaveSession(sessionID);
      navigate("/multiplayer");
    } else if (gameMode === "ai") {
      navigate("/difficulty");
    } else {
      navigate("/");
    }
  }, [gameMode, sessionID, navigate]);

  // Play another round
  const playAgain = useCallback(() => {
    const nextRound = round + 1;
    setBoard(EMPTY_BOARD);
    setX(true);
    setIsPlaying(true);
    setRound(nextRound);

    if (gameMode === "two-players" && sessionID) {
      restartGame(sessionID, nextRound).catch((err) => {
        console.error("Failed to restart Firebase game:", err);
      });
    }
  }, [gameMode, sessionID, round]);

  // Reset scores to 0
  const resetScores = useCallback(() => {
    setScores({ x: 0, o: 0, ties: 0 });

    if (gameMode === "two-players" && sessionID) {
      resetSessionScores(sessionID).catch((err) => {
        console.error("Failed to reset scores in Firestore:", err);
      });
    }
  }, [gameMode, sessionID]);

  // Return to previous menu
  const goToMenu = useCallback(async () => {
    if (gameMode === "two-players" && sessionID) {
      sessionStorage.removeItem(`tictactoe_player_${sessionID}`);
      await leaveSession(sessionID);
      navigate("/multiplayer");
    } else if (gameMode === "ai") {
      navigate("/difficulty");
    } else {
      navigate("/");
    }
  }, [gameMode, sessionID, navigate]);

  // Handle square clicks
  const handleClick = useCallback(
    (index) => {
      if (!isPlaying || winner || isDraw) return;
      if (board[index] !== "") return;
      if (gameMode === "ai" && !isX) return;

      // In two-players online mode, enforce strict turn control
      if (gameMode === "two-players" && sessionID) {
        if (isX && playerRole !== "X") return;
        if (!isX && playerRole !== "O") return;

        const newBoard = [...board];
        newBoard[index] = isX ? "X" : "O";
        const nextIsX = !isX;

        // Optimistically update board locally for zero perceived latency
        setBoard(newBoard);
        setX(nextIsX);

        // Sync to Firebase Firestore
        updateMove(sessionID, newBoard, nextIsX).catch((err) => {
          console.error("Failed to update move in Firestore:", err);
        });
        return;
      }

      // Local / AI mode
      const newBoard = [...board];
      newBoard[index] = isX ? "X" : "O";
      setBoard(newBoard);
      setX((prev) => !prev);
    },
    [isPlaying, winner, isDraw, board, gameMode, isX, sessionID, playerRole]
  );

  // AI Move calculation
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

  // AI turn trigger
  useEffect(() => {
    if (!isPlaying) return;
    if (gameMode !== "ai") return;
    if (isX) return;
    if (winner) return;
    if (isDraw) return;

    const timer = setTimeout(() => {
      aiMove();
    }, 500);

    return () => clearTimeout(timer);
  }, [isPlaying, isX, gameMode, winner, isDraw, aiMove]);

  return {
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
    player: playerRole,
    opponentDisconnected,
  };
}
