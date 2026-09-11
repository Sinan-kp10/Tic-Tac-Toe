import { useState, useEffect, createContext, useCallback } from "react";
import { flushSync } from "react-dom";

export const ThemeContext = createContext();

export function ThemeContextProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  // Apply the theme class to body and html data-theme
  useEffect(() => {
    document.body.className = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const changeTheme = useCallback((event) => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    // Fallback if View Transitions API is not supported or user prefers reduced motion
    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(nextTheme);
      return;
    }

    // Determine the origin coordinates (x, y) for circular expansion
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (
      event &&
      typeof event.clientX === "number" &&
      typeof event.clientY === "number" &&
      (event.clientX !== 0 || event.clientY !== 0)
    ) {
      x = event.clientX;
      y = event.clientY;
    } else if (event?.currentTarget && typeof event.currentTarget.getBoundingClientRect === "function") {
      const rect = event.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    // Calculate the distance to the farthest corner from the origin
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
        document.body.className = nextTheme;
        document.documentElement.setAttribute("data-theme", nextTheme);
      });
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 650,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    }).catch(() => {
      // Catch any unexpected transition errors gracefully
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, toggleTheme: changeTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContextProvider;