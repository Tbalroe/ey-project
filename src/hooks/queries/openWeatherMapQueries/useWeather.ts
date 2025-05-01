import { fetchWeather, WeatherData } from "@/api/openWeatherMapApi";
import { useQuery } from "@tanstack/react-query";

export const useWeather = (lat?: number, lon?: number) =>
  useQuery<WeatherData, Error>({
    queryKey: ["weather", lat, lon],
    queryFn: () => fetchWeather(lat!, lon!),
    enabled: lat != null && lon != null,
  });
