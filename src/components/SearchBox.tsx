import { ChangeEvent, KeyboardEvent, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export interface Suggestion {
  id: string;
  name: string;
  full: string;
  lat: number;
  lon: number;
}

interface Props {
  query: string;
  suggestions: Suggestion[];
  loading: boolean;
  error: boolean;
  onQueryChange: (value: string) => void;
  onPick: (s: Suggestion) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
}

export function SearchBox({
  query,
  suggestions,
  loading,
  error,
  onQueryChange,
  onPick,
  open,
  setOpen,
}: Props) {
  const highlightRef = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    highlightRef.current = 0;
  }, [suggestions]);

  useEffect(() => {
    listRef.current?.children[highlightRef.current]?.scrollIntoView({
      block: "nearest",
    });
  }, [highlightRef.current, suggestions]);

  const pick = (s: Suggestion) => {
    onPick(s);
    onQueryChange(s.full);
    setOpen(false);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      highlightRef.current = (highlightRef.current + 1) % suggestions.length;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      highlightRef.current =
        (highlightRef.current - 1 + suggestions.length) % suggestions.length;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      pick(suggestions[highlightRef.current]);
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
    setOpen(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as HTMLElement | null;
    if (!next || !e.currentTarget.contains(next)) setOpen(false);
  };

  return (
    <div className="relative w-full sm:w-72" tabIndex={-1} onBlur={handleBlur}>
      <Input
        type="search"
        placeholder="Search location…"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKey}
        autoComplete="off"
        className="bg-white"
      />

      {open && (
        <Card
          ref={listRef}
          className="absolute z-10 mt-1 max-h-64 w-full overflow-auto p-0"
        >
          {loading && (
            <div className="px-3 py-2 text-xs text-gray-500">Loading…</div>
          )}
          {error && (
            <div className="px-3 py-2 text-xs text-red-600">
              Couldn’t load suggestions
            </div>
          )}

          {suggestions.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => pick(s)}
              onMouseEnter={() => (highlightRef.current = i)}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                highlightRef.current === i ? "bg-gray-100" : ""
              }`}
            >
              <span className="font-medium">{s.name}</span>
              <span className="block text-xs text-gray-500">{s.full}</span>
            </button>
          ))}
        </Card>
      )}
    </div>
  );
}
