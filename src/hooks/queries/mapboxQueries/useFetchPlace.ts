import { useQuery } from "@tanstack/react-query";
import { fetchPlace, GeoResult } from "@/api/mapboxApi";


export function useFetchPlace(
  lat: number | null,
  lon: number | null,
  staleMs = 1000 * 60 * 5
) {
  const enabled = lat !== null && lon !== null;

  return useQuery<GeoResult | null>({
    queryKey: ["place", lat, lon],
    queryFn: () => fetchPlace(lat!, lon!),
    enabled,
    staleTime: staleMs,
  });
}
