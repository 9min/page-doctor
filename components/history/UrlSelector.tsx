"use client";

interface UrlSelectorProps {
  urls: string[];
  selectedUrl: string;
  onSelect: (url: string) => void;
}

export function UrlSelector({ urls, selectedUrl, onSelect }: UrlSelectorProps) {
  if (urls.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="url-selector"
        className="text-sm font-medium text-muted-foreground whitespace-nowrap"
      >
        URL 선택
      </label>
      <select
        id="url-selector"
        value={selectedUrl}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {urls.map((url) => (
          <option key={url} value={url}>
            {url}
          </option>
        ))}
      </select>
    </div>
  );
}
