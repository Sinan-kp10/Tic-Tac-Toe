function PlayModal({ isOpen, onPlay, onBack, gameMode, difficulty }) {
  if (!isOpen) return null;

  let icon = "👥";
  let title = "Local 2-Player";
  let subtitle = "Two players take turns on this device.";

  if (gameMode === "ai") {
    icon = "🤖";
    const diffLabel = difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : "";
    title = `AI Match ${diffLabel ? `(${diffLabel})` : ""}`;
    subtitle = "Challenge the computer and test your skills!";
  } else if (gameMode === "two-players") {
    icon = "🌐";
    title = "Online Match";
    subtitle = "Compete against your opponent in real-time!";
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-icon">{icon}</div>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-subtitle">{subtitle}</p>

        <div className="modal-actions">
          <button className="modal-play-btn" onClick={onPlay}>
            ▶ Play
          </button>
          <button className="modal-back-btn" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayModal;
