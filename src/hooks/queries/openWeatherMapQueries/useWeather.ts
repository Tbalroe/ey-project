import { useQuery } from "@tanstack/react-query";
import { fetchWeather, WeatherData } from "@/api/openWeatherMapApi";

export function useWeather(lat?: number, lon?: number) {
  return useQuery<WeatherData, Error>({
    queryKey: ["weather", lat, lon],
    queryFn: () => fetchWeather(lat!, lon!),
    enabled: lat != null && lon != null,
  });
}
