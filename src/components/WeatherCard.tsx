import { displayTemp } from "@/lib/utils";

interface Props {
  place: { name: string };
  weather: {
    now: { temp: number; description: string };
    hourly: { dt: number; temp: number; icon: string }[];
    daily: { dt: number; min: number; max: number; icon: string }[];
  };
  unit: "metric" | "imperial";
}

export function WeatherCard({ place, weather, unit }: Props) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
      <div className="rounded-md bg-white/90 backdrop-blur p-4 shadow">
        <p className="text-sm font-medium">{place.name}</p>
        <p className="text-xl font-semibold">
          {Math.round(displayTemp(weather.now.temp, unit))}°
          {unit === "metric" ? "C" : "F"}
        </p>
        <p className="text-xs capitalize text-gray-600">
          {weather.now.description}
        </p>

        <hr className="my-2" />

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
  );
}
