import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Props {
  unit: "metric" | "imperial";
  onToggleUnit: (u: "metric" | "imperial") => void;
}

export function TemperatureToggle({ unit, onToggleUnit }: Props) {
  return (
    <ToggleGroup
      type="single"
      value={unit}
      onValueChange={(v) =>
        (v === "metric" || v === "imperial") && onToggleUnit(v)
      }
      className=" bg-white/80 backdrop-blur-sm shadow flex"
    >
      <ToggleGroupItem value="metric" className="px-3 py-1 text-sm">
        °C
      </ToggleGroupItem>
      <ToggleGroupItem value="imperial" className="px-3 py-1 text-sm">
        °F
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
