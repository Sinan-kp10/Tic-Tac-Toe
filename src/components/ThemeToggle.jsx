import { useContext } from "react";
import { ThemeContext } from "../context/themeContext";

function ThemeToggle() {
  const { theme, changeTheme } = useContext(ThemeContext);

  return (
    <button
      className="theme-toggle-btn"
      onClick={changeTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span className="theme-toggle-icon">{theme === "dark" ? "🌙" : "☀️"}</span>
      <span className="theme-toggle-label">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}

export default ThemeToggle;
