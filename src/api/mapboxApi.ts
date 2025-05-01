const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export interface GeoResult {
  name: string;
  lat: number;
  lon: number;
}

export async function fetchPlace(
  lat: number,
  lon: number
): Promise<GeoResult | null> {
  const requestUrl =
    "https://api.mapbox.com/search/geocode/v6/reverse" +
    `?latitude=${lat}&longitude=${lon}` +
    `&limit=1&language=en` +
    `&access_token=${MAPBOX_TOKEN}`;

  const response = await fetch(requestUrl);
  if (!response.ok) {
    throw new Error(`Mapbox reverse geocoding failed (${response.status})`);
  }

  const { features } = await response.json();
  if (!features?.length) return null;

  const feature = features[0];
  return {
    name: feature.properties?.full_address ?? feature.place_name,
    lat: feature.geometry.coordinates[1],
    lon: feature.geometry.coordinates[0],
  };
}

export interface Place {
  id: string;
  name: string;
  full: string;
  lat: number;
  lon: number;
}

interface MapboxFeature {
  id: string;
  text?: string;
  place_name?: string;
  properties?: {
    name?: string;
    full_address?: string;
  };
  geometry: { coordinates: [number, number] };
}

export async function fetchPlaces(query: string): Promise<Place[]> {
  if (query.trim().length < 3) return [];

  const requestUrl =
    "https://api.mapbox.com/search/geocode/v6/forward" +
    `?q=${encodeURIComponent(query)}` +
    `&limit=5&language=en` +
    `&access_token=${MAPBOX_TOKEN}`;

  const response = await fetch(requestUrl);
  if (!response.ok) throw new Error("Mapbox search failed");

  const { features } = (await response.json()) as {
    features: MapboxFeature[];
  };

  return features.map((feature) => ({
    id: feature.id,
    name: feature.properties?.name ?? feature.text ?? "",
    full: feature.properties?.full_address ?? feature.place_name ?? "",
    lat: feature.geometry.coordinates[1],
    lon: feature.geometry.coordinates[0],
  }));
}
