import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      return "dark";
    }

    if (savedTheme === "light") {
      return "light";
    }
  } catch (error) {
    console.warn("Unable to read saved theme:", error);
  }

  /* System preference */

  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return "light";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    const body = document.body;

    const isDark = theme === "dark";

    /* Root */

    root.classList.toggle("dark-theme", isDark);

    root.classList.toggle("light-theme", !isDark);

    root.setAttribute("data-theme", theme);

    /* Body */

    body.classList.toggle("dark-theme", isDark);

    body.classList.toggle("light-theme", !isDark);

    /* Persist */

    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.warn("Unable to save theme:", error);
    }

    /* Notify components */

    window.dispatchEvent(
      new CustomEvent("taskflow-theme-change", {
        detail: {
          theme,
        },
      }),
    );
  }, [theme]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== "theme") {
        return;
      }

      if (event.newValue === "dark" || event.newValue === "light") {
        setTheme(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const setLightTheme = () => {
    setTheme("light");
  };

  const setDarkTheme = () => {
    setTheme("dark");
  };

  const value = useMemo(
    () => ({
      theme,

      darkMode: theme === "dark",

      isDark: theme === "dark",

      isLight: theme === "light",

      toggleTheme,

      setTheme,

      setLightTheme,

      setDarkTheme,
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
};

export default ThemeContext;
