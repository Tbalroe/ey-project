import { useEffect, useRef } from "react";
import Map, { MapRef, MapMouseEvent } from "react-map-gl/mapbox";
import { Coords } from "@/App";

interface Props {
  coords: Coords | null;
  onMapClick: (c: Coords) => void;
}

export function MapView({ coords, onMapClick }: Props) {
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (!coords) return;
    mapRef.current?.flyTo({
      center: [coords.lon, coords.lat],
      zoom: 12,
      essential: true,
    });
  }, [coords]);

  const handleClick = (e: MapMouseEvent) => {
    const { lat, lng } = e.lngLat;
    onMapClick({ lat, lon: lng });
  };

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      initialViewState={{ longitude: 0, latitude: 0, zoom: 2 }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      style={{ width: "100%", height: "100%" }}
      onClick={handleClick}
    />
  );
}
