import { useContext } from "react";
import { ThemeContext } from "../context/themeContext";

function ThemeToggle() {
  const { theme, changeTheme } = useContext(ThemeContext);

  return (
    <button className="theme-toggle-btn" onClick={changeTheme}>
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

export default ThemeToggle;
