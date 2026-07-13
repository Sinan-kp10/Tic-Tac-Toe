function Difficulty({ setDifficulty }) {
  return (
    <div className="menu">

      <h1>Select Difficulty</h1>

      <button onClick={() => setDifficulty("easy")}>
        🟢 Easy
      </button>

      <button onClick={() => setDifficulty("medium")}>
        🟡 Medium
      </button>

      <button onClick={() => setDifficulty("hard")}>
        🔴 Hard
      </button>

    </div>
  );
}

export default Difficulty;