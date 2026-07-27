import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      return true;
    }

    if (savedTheme === "light") {
      return false;
    }

    return window.matchMedia?.(
      "(prefers-color-scheme: dark)"
    ).matches ?? false;
  });

  /* ==========================================
      APPLY THEME
  ========================================== */

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (darkMode) {
      root.classList.add("dark-theme");
      body.classList.add("dark-theme");

      root.setAttribute("data-theme", "dark");

      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark-theme");
      body.classList.remove("dark-theme");

      root.setAttribute("data-theme", "light");

      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* ==========================================
      TOGGLE
  ========================================== */

  const toggleTheme = () => {
    setDarkMode((previous) => !previous);
  };

  /* ==========================================
      VALUE
  ========================================== */

  const value = useMemo(
    () => ({
      darkMode,
      setDarkMode,
      toggleTheme,
      theme: darkMode ? "dark" : "light",
    }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/* ==========================================
    HOOK
========================================== */

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
};

export default ThemeContext;