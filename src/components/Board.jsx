import React, { useMemo } from "react";
import Square from "./Square";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function Board({ board, handleClick, winner, winningLine }) {
  // Memoize winning square indices so squares don't recalculate on every render
  const winningIndices = useMemo(() => {
    if (winningLine === null || winningLine === undefined) return new Set();
    const combo = WINNING_COMBINATIONS[winningLine];
    return combo ? new Set(combo) : new Set();
  }, [winningLine]);

  return (
    <div className="board">
      {board.map((value, index) => (
        <Square
          key={index}
          value={value}
          isWinning={winningIndices.has(index)}
          onClick={() => handleClick(index)}
        />
      ))}

      {winningLine !== null && winningLine !== undefined && (
        <div className={`winning-line combo-${winningLine} winner-${winner}`} />
      )}
    </div>
  );
}

export default React.memo(Board);