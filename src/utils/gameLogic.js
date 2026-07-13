export function calculateWinner(board) {
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

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

export function checkWinner(tempBoard) {
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

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

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

export function minimax(tempBoard, isMaximizing) {
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

export function getEasyMove(board) {
  const emptySquares = board
    .map((value, index) => (value === "" ? index : null))
    .filter((index) => index !== null);

  if (emptySquares.length === 0) return -1;

  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  return emptySquares[randomIndex];
}

export function getMediumMove(board) {
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

  // AI tries to win
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    const values = [board[a], board[b], board[c]];

    if (
      values.filter((value) => value === "O").length === 2 &&
      values.includes("")
    ) {
      return combination[values.indexOf("")];
    }
  }

  // Block player
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    const values = [board[a], board[b], board[c]];

    if (
      values.filter((value) => value === "X").length === 2 &&
      values.includes("")
    ) {
      return combination[values.indexOf("")];
    }
  }

  // Otherwise random move
  return getEasyMove(board);
}

export function getHardMove(board) {
  let bestScore = -Infinity;
  let bestMove = -1;
  const tempBoard = [...board];

  for (let i = 0; i < 9; i++) {
    if (tempBoard[i] === "") {
      tempBoard[i] = "O";
      const score = minimax(tempBoard, false);
      tempBoard[i] = "";

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

export function getWinningLine(board) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return i;
    }
  }

  return null;
}
