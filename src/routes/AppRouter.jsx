import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Difficulty from "../pages/Difficulty";
import Multiplayer from "../pages/Multiplayer";
import CreateSession from "../pages/CreateSession";
import JoinSession from "../pages/JoinSession";
import Game from "../pages/Game";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/difficulty" element={<Difficulty />} />
      <Route path="/multiplayer" element={<Multiplayer />} />
      <Route path="/multiplayer/create/:sessionId" element={<CreateSession />} />
      <Route path="/multiplayer/join" element={<JoinSession />} />
      <Route path="/game/local" element={<Game gameMode="local" />} />
      <Route path="/game/ai/:difficulty" element={<Game gameMode="ai" />} />
      <Route path="/game/multiplayer/:sessionId" element={<Game gameMode="two-players" />} />
    </Routes>
  );
}

export default AppRouter;
