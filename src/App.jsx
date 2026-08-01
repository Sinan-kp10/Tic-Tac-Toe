import { Routes, Route } from "react-router-dom";
import GameMode from "./components/GameMode";
import Difficulty from "./components/Difficulty";
import PlayTwoPlayers from "./components/play-two-players";
import { CreateSession, JoinSession } from "./components/Session";
import GameBoard from "./components/GameBoard";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<GameMode />} />
      <Route path="/difficulty" element={<Difficulty />} />
      <Route path="/multiplayer" element={<PlayTwoPlayers />} />
      <Route path="/multiplayer/create/:sessionId" element={<CreateSession />} />
      <Route path="/multiplayer/join" element={<JoinSession />} />
      <Route path="/game/local" element={<GameBoard gameMode="local" />} />
      <Route path="/game/ai/:difficulty" element={<GameBoard gameMode="ai" />} />
      <Route path="/game/multiplayer/:sessionId" element={<GameBoard gameMode="two-players" />} />
    </Routes>
  );
}

export default App;