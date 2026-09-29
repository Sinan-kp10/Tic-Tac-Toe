import React from "react";

function GameStatus({ winner, isDraw, isX, isPlaying }) {
  return (
    <h2>
      {winner
        ? `🎉 Winner : ${winner}`
        : isDraw
        ? "🤝 Match Draw!"
        : !isPlaying
        ? "🎮 Ready to Play?"
        : `Turn : ${isX ? "X" : "O"}`}
    </h2>
  );
}

export default React.memo(GameStatus);