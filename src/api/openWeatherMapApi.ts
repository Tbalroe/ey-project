export interface WeatherData {
  now: {
    temp: number;
    description: string;
    icon: string;
  };
  hourly: { dt: number; temp: number; icon: string }[];
  daily: { dt: number; min: number; max: number; icon: string }[];
}

interface OWMResponse {
  current: {
    temp: number;
    weather: { icon: string; description: string }[];
  };
  hourly: {
    dt: number;
    temp: number;
    weather: { icon: string }[];
  }[];
  daily: {
    dt: number;
    temp: { min: number; max: number };
    weather: { icon: string }[];
  }[];
}

export async function fetchWeather(
  lat: number,
  lon: number,
  unit: "metric" | "imperial" = "metric"
): Promise<WeatherData> {
  const url =
    "https://api.openweathermap.org/data/3.0/onecall" +
    `?lat=${lat}&lon=${lon}` +
    `&units=${unit}` +
    `&exclude=minutely,alerts` +
    `&appid=${import.meta.env.VITE_OPENWEATHER_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`OpenWeather error (${res.status})`);

  const json: OWMResponse = await res.json();

  return {
    now: {
      temp: json.current.temp,
      description: json.current.weather[0].description,
      icon: json.current.weather[0].icon,
    },
    hourly: json.hourly.slice(0, 24).map((h) => ({
      dt: h.dt,
      temp: h.temp,
      icon: h.weather[0].icon,
    })),
    daily: json.daily.slice(0, 7).map((d) => ({
      dt: d.dt,
      min: d.temp.min,
      max: d.temp.max,
      icon: d.weather[0].icon,
    })),
  };
}
