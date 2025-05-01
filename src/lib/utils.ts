import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function displayTemp(baseCelsius: number, unit: "metric" | "imperial") {
  return unit === "metric" ? baseCelsius : baseCelsius * 9 / 5 + 32;
}
