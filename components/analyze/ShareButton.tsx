"use client";

import { useState, useCallback } from "react";
import { Share2, Check } from "lucide-react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "링크가 복사되었습니다" : "분석 결과 링크 복사"}
      className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-success" aria-hidden="true" />
          복사됨
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" aria-hidden="true" />
          공유
        </>
      )}
    </button>
  );
}
