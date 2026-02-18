"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground cursor-pointer"
        aria-label={t("theme.toggle")}
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground cursor-pointer"
      aria-label={t("theme.toggle")}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
