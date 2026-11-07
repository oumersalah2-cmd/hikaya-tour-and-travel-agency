"use client";

import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

export default function ThemeToggle({ onDark = false }: { onDark?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative rounded-full p-2 transition-colors duration-300 ${
        onDark
          ? "bg-white/10 text-white hover:bg-white/20"
          : "bg-gray-100 hover:bg-gray-200 dark:bg-dark-300 dark:hover:bg-dark-200"
      }`}
      aria-label={isDark ? t.ui.switchToLight : t.ui.switchToDark}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-accent-300" />
        ) : (
          <Moon className={`h-5 w-5 ${onDark ? "text-white" : "text-primary-600"}`} />
        )}
      </motion.div>
    </button>
  );
}
