import Square from "./Square";

function Board({ board, handleClick }) {
  return (
    <div className="board">
      {board.map((value, index) => (
        <Square key={index} value={value} onClick={() => handleClick(index)} />
      ))}
      
    </div>
  );
}

export default Board;