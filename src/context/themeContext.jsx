import { useState, useEffect, createContext } from "react";


export const ThemeContext = createContext();

function ThemeContextProvider({ children }) {

  const [theme, setTheme] = useState("dark");
  const changeTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Apply the theme class ("dark" or "light") to the HTML body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContextProvider;