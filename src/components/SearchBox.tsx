import { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Place } from "@/api/mapboxApi";
import { useDebouncedValue } from "@/hooks/useDebounce";
import { usePlaceSuggestions } from "@/hooks/queries/mapboxQueries/usePlaceSuggestions";

interface Props {
  onSelectLocation: (loc: { lat: number; lon: number; name: string }) => void;
}

export default function SearchBox({ onSelectLocation }: Props) {
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query, 300);

  const [highlight, setHighlight] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const { data: suggestions = [], isFetching } = usePlaceSuggestions(
    debounced,
    isOpen
  );

  useEffect(() => {
    if (suggestions.length && !isFetching) setIsOpen(true);
  }, [suggestions, isFetching]);

  useEffect(() => {
    const el = listRef.current?.children[highlight] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlight]);

  const pick = (p: Place) => {
    onSelectLocation({ lat: p.lat, lon: p.lon, name: p.full });
    setQuery(p.full);
    setIsOpen(false);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % suggestions.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      pick(suggestions[highlight]);
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setHighlight(0);

    if (value.trim().length >= 3) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as HTMLElement | null;
    if (!next || !e.currentTarget.contains(next)) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full sm:w-72 " tabIndex={-1} onBlur={handleBlur}>
      <Input
        type="search"
        placeholder="Search location…"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKey}
        autoComplete="off"
        className="bg-white"
      />

      {isOpen && (
        <Card
          ref={listRef}
          className="absolute z-10 mt-1 max-h-64 w-full overflow-auto p-0"
        >
          {suggestions.map((place, idx) => (
            <button
              key={place.id}
              type="button"
              onClick={() => pick(place)}
              onMouseEnter={() => setHighlight(idx)}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                idx === highlight ? "bg-gray-100" : ""
              }`}
            >
              <span className="font-medium">{place.name}</span>
              <span className="block text-xs text-gray-500">{place.full}</span>
            </button>
          ))}
        </Card>
      )}
    </div>
  );
}
