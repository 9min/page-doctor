"use client";

import { useSyncExternalStore } from "react";
import { Languages } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useTranslation();
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground cursor-pointer"
        aria-label={t("locale.switch")}
      >
        <Languages className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={locale === "ko"}
      onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
      className="flex h-9 items-center justify-center gap-1 rounded-xl border border-border bg-secondary px-2.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground cursor-pointer"
      aria-label={t("locale.switch")}
    >
      <Languages className="h-3.5 w-3.5" />
      {locale === "ko" ? "EN" : "KO"}
    </button>
  );
}
