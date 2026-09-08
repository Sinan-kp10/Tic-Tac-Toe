import AppRouter from "./routes/AppRouter";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";

function App() {
  return (
    <div className="app-wrapper">
      <ThemeToggle />
      <AppRouter />
    </div>
  );
}

export default App;