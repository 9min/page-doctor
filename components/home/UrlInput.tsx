"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Monitor, Smartphone, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Strategy } from "@/types";
import { isValidUrl, normalizeUrl } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

export function UrlInput() {
  const router = useRouter();
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<Strategy>("desktop");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError(t("input.error.empty"));
      return;
    }

    if (!isValidUrl(trimmed)) {
      setError(t("input.error.invalid"));
      return;
    }

    const normalized = normalizeUrl(trimmed);
    router.push(
      `/analyze?url=${encodeURIComponent(normalized)}&strategy=${strategy}`
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="glass-card flex flex-col gap-4 p-5">
        {/* URL Input + Submit */}
        <div className="flex gap-2">
          <div className="focus-glow relative flex-1 rounded-xl border border-border transition-all duration-200">
            <Search
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="text"
              placeholder={t("input.placeholder")}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              className="border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
              aria-label={t("input.ariaLabel")}
            />
          </div>
          <button
            type="submit"
            className="btn-gradient flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer"
          >
            {t("input.submit")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Strategy Toggle + Error */}
        <div className="flex items-center justify-between">
          <div
            className="flex gap-1 rounded-xl bg-secondary p-1"
            role="radiogroup"
            aria-label={t("input.strategy")}
          >
            <button
              type="button"
              onClick={() => setStrategy("desktop")}
              aria-checked={strategy === "desktop"}
              role="radio"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                strategy === "desktop"
                  ? "bg-[#3B82F6]/10 text-[#3B82F6] shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
              {t("input.desktop")}
            </button>
            <button
              type="button"
              onClick={() => setStrategy("mobile")}
              aria-checked={strategy === "mobile"}
              role="radio"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                strategy === "mobile"
                  ? "bg-[#3B82F6]/10 text-[#3B82F6] shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
              {t("input.mobile")}
            </button>
          </div>

          {error && (
            <p className="text-xs font-medium text-danger" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
