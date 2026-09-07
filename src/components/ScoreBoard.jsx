function ScoreBoard({
  scores,
  gameMode,
  difficulty,
  player,
  isX,
  isPlaying,
  winner,
  isDraw,
  onResetScores,
}) {
  // Determine labels
  let xLabel = "Player X";
  let oLabel = "Player O";

  if (gameMode === "ai") {
    xLabel = "You (X)";
    const diffText = difficulty
      ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
      : "Bot";
    oLabel = `AI (${diffText})`;
  } else if (gameMode === "two-players") {
    xLabel = player === "X" ? "You (X)" : "Host (X)";
    oLabel = player === "O" ? "You (O)" : "Visitor (O)";
  }

  const isXActive = isPlaying && isX && !winner && !isDraw;
  const isOActive = isPlaying && !isX && !winner && !isDraw;
  const isXWinner = winner === "X";
  const isOWinner = winner === "O";

  const hasScore = (scores?.x || 0) > 0 || (scores?.o || 0) > 0 || (scores?.ties || 0) > 0;

  return (
    <div className="scoreboard-wrapper">
      <div className="scoreboard">
        {/* Player X */}
        <div
          className={`score-card score-card-x ${
            isXWinner ? "winner-card" : isXActive ? "active-turn" : ""
          }`}
        >
          <div className="score-header" title={xLabel}>
            <span className="score-icon">{gameMode === "ai" ? "👤" : "✕"}</span>
            <span className="score-name">{xLabel}</span>
          </div>
          <div className="score-value">{scores?.x || 0}</div>
          {isXWinner ? (
            <span className="score-badge win-badge">👑 Win</span>
          ) : isXActive ? (
            <span className="score-badge turn-badge">Turn</span>
          ) : (
            <span className="score-badge-placeholder">-</span>
          )}
        </div>

        {/* Ties / Draws */}
        <div
          className={`score-card score-card-ties ${
            isDraw ? "draw-card" : ""
          }`}
        >
          <div className="score-header" title="Draws">
            <span className="score-icon">🤝</span>
            <span className="score-name">Ties</span>
          </div>
          <div className="score-value">{scores?.ties || 0}</div>
          {isDraw ? (
            <span className="score-badge draw-badge">Draw</span>
          ) : (
            <span className="score-badge-placeholder">-</span>
          )}
        </div>

        {/* Player O */}
        <div
          className={`score-card score-card-o ${
            isOWinner ? "winner-card" : isOActive ? "active-turn" : ""
          }`}
        >
          <div className="score-header" title={oLabel}>
            <span className="score-icon">{gameMode === "ai" ? "🤖" : "◯"}</span>
            <span className="score-name">{oLabel}</span>
          </div>
          <div className="score-value">{scores?.o || 0}</div>
          {isOWinner ? (
            <span className="score-badge win-badge">👑 Win</span>
          ) : isOActive ? (
            <span className="score-badge turn-badge">Turn</span>
          ) : (
            <span className="score-badge-placeholder">-</span>
          )}
        </div>
      </div>

      {hasScore && (
        <button
          className="reset-score-btn"
          onClick={onResetScores}
          title="Reset Scores to 0"
        >
          ↺ Reset Scores
        </button>
      )}
    </div>
  );
}

export default ScoreBoard;
