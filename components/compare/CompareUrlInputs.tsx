"use client";

import { useState } from "react";
import { Plus, Minus, Loader2 } from "lucide-react";
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
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                {i + 1}
              </span>
              <input
                type="text"
                value={url}
                onChange={(e) => updateUrl(i, e.target.value)}
                placeholder={`https://example${i + 1}.com`}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isComparing}
              />
              {urls.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeUrl(i)}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
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
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          URL 추가
        </button>
      )}

      {/* Strategy selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">전략:</span>
        <label className="flex items-center gap-1.5 text-sm">
          <input
            type="radio"
            name="strategy"
            value="mobile"
            checked={strategy === "mobile"}
            onChange={() => setStrategy("mobile")}
            disabled={isComparing}
          />
          모바일
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          <input
            type="radio"
            name="strategy"
            value="desktop"
            checked={strategy === "desktop"}
            onChange={() => setStrategy("desktop")}
            disabled={isComparing}
          />
          데스크톱
        </label>
      </div>

      <button
        type="submit"
        disabled={isComparing}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
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
