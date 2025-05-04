import { useState } from "react";
import "./index.css";

import { SearchBox } from "./components/SearchBox";
import { TemperatureToggle } from "./components/TemperatureToggle";

import { usePlaceSuggestions } from "@/hooks/queries/mapboxQueries/usePlaceSuggestions";
import { useFetchPlace } from "@/hooks/queries/mapboxQueries/useFetchPlace";
import { useWeather } from "@/hooks/queries/openWeatherMapQueries/useWeather";
import { MapView } from "./components/MapView";
import { WeatherCard } from "./components/WeatherCard";
import { useDebounced } from "./hooks/useDebounce";

export interface Coords {
  lat: number;
  lon: number;
}

export function App() {
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState<Coords | null>(null);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounced(query, 125);

  const {
    data: suggestions = [],
    isFetching,
    isError,
  } = usePlaceSuggestions(debouncedQuery, open);

  const { data: place } = useFetchPlace(coords?.lat, coords?.lon);

  const { data: weather } = useWeather(coords?.lat, coords?.lon);

  const handleSuggestionPick = (p: {
    lat: number;
    lon: number;
    name: string;
  }) => {
    setCoords({ lat: p.lat, lon: p.lon });
    setQuery(p.name);
  };

  const handleMapClick = (c: Coords) => {
    setCoords(c);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="h-full w-full p-2 flex flex-col">
      <div className="flex-1 rounded-2xl overflow-hidden">
        <MapView coords={coords} onMapClick={handleMapClick} />
      </div>

      {place && weather && (
        <WeatherCard place={place} weather={weather} unit={unit} />
      )}
      <div className="mb-2 flex gap-4 absolute top-4 left-4">
        <SearchBox
          query={query}
          suggestions={suggestions}
          loading={isFetching}
          error={isError}
          onQueryChange={setQuery}
          onPick={handleSuggestionPick}
          open={open}
          setOpen={setOpen}
        />
        <TemperatureToggle unit={unit} onToggleUnit={setUnit} />
      </div>
    </div>
  );
}

export default App;
