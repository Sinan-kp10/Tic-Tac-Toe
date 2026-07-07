function GameStatus({winner, isDraw, isX }){
    return (
    <h2>
        {winner
            ? `🎉 Winner : ${winner}`
            : isDraw
            ? "🤝 Match Draw!"
            : `Turn : ${isX ? "X" : "O"}`}
    </h2>

        

    )
}

export default GameStatus;