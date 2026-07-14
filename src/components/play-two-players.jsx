function PlayTwoPlayers({ setGameMode, setIsHost, createSession }) {

    return (
        <div className="menu">
            <h1>Tic Tac Toe</h1>

            <button onClick={() => {
                createSession();
                setIsHost("create-session");
            }}>
                Create Session
            </button>

            <button onClick={() => setIsHost("join-session")}>
                Join Session
            </button>
            <button onClick={() => setGameMode("")}>
                Back
            </button>
        </div>
    );
}

export default PlayTwoPlayers;