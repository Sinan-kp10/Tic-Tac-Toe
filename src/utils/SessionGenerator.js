function generateSessionID() {
    let sessionId = "";

    for (let i = 0; i < 10; i++) {
        sessionId = Math.floor(Math.random() * 10000000000);
    }

    return sessionId;
}

export { generateSessionID };