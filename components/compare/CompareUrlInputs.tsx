"use client";

import { useState } from "react";
import { Plus, Minus, Loader2, Monitor, Smartphone } from "lucide-react";
import { isValidUrl, normalizeUrl } from "@/lib/utils";
import type { Strategy } from "@/types";

interface CompareUrlInputsProps {
  isComparing: boolean;
  onCompare: (urls: string[], strategy: Strategy) => void;
}

export function CompareUrlInputs({
  isComparing,
  onCompare,
}: CompareUrlInputsProps) {
  const [urls, setUrls] = useState(["", ""]);
  const [strategy, setStrategy] = useState<Strategy>("desktop");
  const [errors, setErrors] = useState<string[]>([]);

  const addUrl = () => {
    if (urls.length < 5) {
      setUrls([...urls, ""]);
    }
  };

  const removeUrl = (index: number) => {
    if (urls.length > 2) {
      setUrls(urls.filter((_, i) => i !== index));
      setErrors(errors.filter((_, i) => i !== index));
    }
  };

  const updateUrl = (index: number, value: string) => {
    const next = [...urls];
    next[index] = value;
    setUrls(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors: string[] = urls.map((url) => {
      if (!url.trim()) return "URL을 입력해주세요.";
      if (!isValidUrl(url)) return "올바른 URL을 입력해주세요.";
      return "";
    });

    setErrors(validationErrors);

    if (validationErrors.some((e) => e !== "")) return;

    const normalized = urls.map((u) => normalizeUrl(u));
    onCompare(normalized, strategy);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">비교할 URL 입력</h2>
        <span className="text-sm text-muted-foreground">
          {urls.length}/5 URL
        </span>
      </div>

      <div className="space-y-3">
        {urls.map((url, i) => (
          <div key={i}>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/10 text-xs font-semibold text-[#3B82F6]">
                {i + 1}
              </span>
              <div className="focus-glow w-full rounded-xl border border-border/50 transition-all duration-200">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => updateUrl(i, e.target.value)}
                  placeholder={`https://example${i + 1}.com`}
                  className="w-full rounded-xl border-0 bg-transparent px-3 py-2 text-sm outline-none"
                  disabled={isComparing}
                  aria-label={`비교할 URL ${i + 1}`}
                />
              </div>
              {urls.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeUrl(i)}
                  className="rounded-lg p-2 text-muted-foreground transition-colors duration-150 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                  aria-label="URL 제거"
                  disabled={isComparing}
                >
                  <Minus className="h-4 w-4" />
                </button>
              )}
            </div>
            {errors[i] && (
              <p className="mt-1 ml-9 text-xs text-danger">{errors[i]}</p>
            )}
          </div>
        ))}
      </div>

      {urls.length < 5 && (
        <button
          type="button"
          onClick={addUrl}
          disabled={isComparing}
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          URL 추가
        </button>
      )}

      {/* Strategy selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">전략:</span>
        <div className="flex gap-1 rounded-xl bg-secondary p-1" role="radiogroup" aria-label="분석 전략">
          <button
            type="button"
            role="radio"
            aria-checked={strategy === "desktop"}
            onClick={() => setStrategy("desktop")}
            disabled={isComparing}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
              strategy === "desktop"
                ? "bg-[#3B82F6]/10 text-[#3B82F6] shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
            데스크톱
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={strategy === "mobile"}
            onClick={() => setStrategy("mobile")}
            disabled={isComparing}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
              strategy === "mobile"
                ? "bg-[#3B82F6]/10 text-[#3B82F6] shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
            모바일
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isComparing}
        className="btn-gradient w-full rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50 cursor-pointer"
      >
        {isComparing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            비교 분석 중...
          </span>
        ) : (
          "비교 분석 시작"
        )}
      </button>
    </form>
  );
}
