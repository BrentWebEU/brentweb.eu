'use client';

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("system");
    } else {
      setTheme("dark");
    }
  };

  const getIcon = () => {
    if (!mounted) {
      return <Monitor className="theme-toggle__icon" />;
    }
    if (theme === "light") {
      return <Sun className="theme-toggle__icon" />;
    } else if (theme === "dark") {
      return <Moon className="theme-toggle__icon" />;
    } else {
      return <Monitor className="theme-toggle__icon" />;
    }
  };

  const getLabel = () => {
    if (!mounted) {
      return "Theme toggle";
    }
    if (theme === "light") {
      return "Light mode";
    } else if (theme === "dark") {
      return "Dark mode";
    } else {
      return "System mode";
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="theme-toggle"
      aria-label={getLabel()}
      title={getLabel()}
      type="button"
    >
      {getIcon()}
    </button>
  );
};
