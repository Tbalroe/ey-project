import { useQuery } from "@tanstack/react-query";
import { fetchPlaces, Place } from "@/api/mapboxApi";

export function usePlaceSuggestions(
  query: string,
  isOpen: boolean,
  staleMs = 1000 * 60 * 5
) {
  const enabled = isOpen && query.trim().length > 2;

  return useQuery<Place[]>({
    queryKey: ["places", query],
    queryFn: () => fetchPlaces(query),
    enabled,
    staleTime: staleMs,
  });
}
