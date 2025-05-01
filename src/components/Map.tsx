import { useRef, useState } from "react";
import Map, { MapMouseEvent, MapRef } from "react-map-gl/mapbox";
import { useFetchPlace } from "@/hooks/queries/mapboxQueries/useFetchPlace";
import { useWeather } from "@/hooks/queries/openWeatherMapQueries/useWeather";
import SearchBox from "./SearchBox";
import { TemperatureToggle } from "./TemperatureToggle";
import { displayTemp } from "@/lib/utils";

interface Coords {
  lat: number;
  lon: number;
}
interface Place extends Coords {
  name: string;
}

export function MapView() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const { data: place } = useFetchPlace(
    coords?.lat ?? null,
    coords?.lon ?? null
  );
  const { data: weather } = useWeather(coords?.lat, coords?.lon);

  const mapRef = useRef<MapRef>(null);

  const handleMapClick = (e: MapMouseEvent) => {
    const { lat, lng } = e.lngLat;
    setCoords({ lat, lon: lng });
  };

  const handleSearchPick = (loc: Place) => {
    setCoords({ lat: loc.lat, lon: loc.lon });
    mapRef.current?.flyTo({
      center: [loc.lon, loc.lat],
      zoom: 8,
      essential: true,
    });
  };

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden">
      <Map
        ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{ longitude: -122.4, latitude: 37.8, zoom: 12 }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "100%" }}
        onClick={handleMapClick}
      />

      <div className="absolute top-4 left-4 w-72">
        <SearchBox onSelectLocation={handleSearchPick} />
      </div>

      <div className="absolute top-4 right-4">
        <TemperatureToggle unit={unit} onToggleUnit={setUnit} />
      </div>

      {place && weather && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="rounded-md bg-white/90 backdrop-blur p-4 shadow">
            {/* location & current temp */}
            <p className="text-sm font-medium">{place.name}</p>
            <p className="text-xl font-semibold">
              {Math.round(displayTemp(weather.now.temp, unit))}°
              {unit === "metric" ? "C" : "F"}
            </p>
            <p className="text-xs capitalize text-gray-600">
              {weather.now.description}
            </p>

            <hr className="my-2" />

            {/* next 8 hours */}
            <div className="flex gap-2 overflow-x-auto">
              {weather.hourly.slice(0, 8).map((h) => (
                <div key={h.dt} className="flex flex-col items-center text-xs">
                  {new Date(h.dt * 1000).getHours()}
                  <img
                    src={`https://openweathermap.org/img/wn/${h.icon}.png`}
                    alt=""
                  />
                  {Math.round(displayTemp(h.temp, unit))}°
                </div>
              ))}
            </div>

            {/* 7-day grid */}
            <div className="mt-2 grid grid-cols-7 gap-1 text-center text-xs">
              {weather.daily.map((d) => (
                <div
                  key={d.dt}
                  className="flex flex-col items-center p-1 rounded-md hover:bg-gray-100"
                >
                  <span className="font-medium">
                    {new Date(d.dt * 1000)
                      .toLocaleDateString("en-US", { weekday: "short" })
                      .slice(0, 2)}
                  </span>
                  <img
                    className="h-6 w-6"
                    src={`https://openweathermap.org/img/wn/${d.icon}.png`}
                    alt=""
                  />
                  <span>
                    {Math.round(displayTemp(d.max, unit))}°
                    <span className="text-gray-500">
                      /{Math.round(displayTemp(d.min, unit))}°
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
