import Square from "./Square";

function Board({ board, handleClick, winner, winningLine }) {
  return (
    <div className="board">
      {board.map((value, index) => (
        <Square key={index} value={value} onClick={() => handleClick(index)} />
      ))}
      
      {winningLine !== null && (
        <div className={`winning-line combo-${winningLine} winner-${winner}`} />
      )}
    </div>
  );
}

export default Board;