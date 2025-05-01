import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";


export interface TemperatureToggleProps {
  unit: "metric" | "imperial";
  onToggleUnit: (unit: "metric" | "imperial") => void;
}


export const TemperatureToggle: React.FC<TemperatureToggleProps> = ({
  unit,
  onToggleUnit,
}) => {
  const handleChange = (value: string) => {
    if (value === "metric" || value === "imperial") {
      onToggleUnit(value);
    }
  };

  return (
    <ToggleGroup
      type="single"
      value={unit}
      onValueChange={handleChange}
      className="rounded-full bg-white/80 backdrop-blur-sm p-1 shadow flex"
    >
      <ToggleGroupItem
        value="metric"
        aria-label="Celsius"
        className="px-3 py-1 text-sm "
      >
        °C
      </ToggleGroupItem>
      <ToggleGroupItem
        value="imperial"
        aria-label="Fahrenheit"
        className="px-3 py-1 text-sm"
      >
        °F
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
