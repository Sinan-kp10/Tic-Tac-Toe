import React from "react";

function Square({ value, onClick, isWinning }) {
  return (
    <div
      className={`square ${value} ${isWinning ? "winning-square" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={value ? `Square ${value}` : "Empty square"}
    >
      {value}
    </div>
  );
}

// React.memo prevents re-rendering squares whose value & winning status haven't changed
export default React.memo(Square);