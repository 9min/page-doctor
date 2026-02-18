"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Strategy } from "@/types";
import { isValidUrl, normalizeUrl } from "@/lib/utils";

export function UrlInput() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<Strategy>("desktop");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError("URL을 입력해주세요.");
      return;
    }

    if (!isValidUrl(trimmed)) {
      setError("유효한 URL을 입력해주세요.");
      return;
    }

    const normalized = normalizeUrl(trimmed);
    router.push(
      `/analyze?url=${encodeURIComponent(normalized)}&strategy=${strategy}`
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="glass-card flex flex-col gap-3 p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="text"
              placeholder="URL을 입력하세요 (예: example.com)"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              className="pl-9"
              aria-label="분석할 URL"
            />
          </div>
          <Button type="submit">분석</Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1" role="radiogroup" aria-label="분석 전략">
            <Button
              type="button"
              variant={strategy === "mobile" ? "default" : "outline"}
              size="sm"
              onClick={() => setStrategy("mobile")}
              aria-checked={strategy === "mobile"}
              role="radio"
            >
              <Smartphone className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              모바일
            </Button>
            <Button
              type="button"
              variant={strategy === "desktop" ? "default" : "outline"}
              size="sm"
              onClick={() => setStrategy("desktop")}
              aria-checked={strategy === "desktop"}
              role="radio"
            >
              <Monitor className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              데스크톱
            </Button>
          </div>

          {error && (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
