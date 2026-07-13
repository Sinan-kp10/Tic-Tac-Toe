
function Square({value , onClick}){
    return (
        <div className={`square ${value}`} onClick={onClick}>{value}</div>
    )
}

export default Square;