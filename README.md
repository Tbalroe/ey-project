# World-Weather App 🌦️

A single-page React + TypeScript demo.  
Search any place or click directly on a Mapbox map and get instant weather plus a mini-forecast.

---

## 🚀 How to run it

```bash
# 1 – clone & install dependencies
git clone https://github.com/your-username/world-weather.git
cd world-weather
pnpm install          # or npm / yarn

# 2 – add API keys
cp .env.example .env  # then edit .env and paste your keys

# 3 – start dev server
pnpm dev
# ↪ opens http://localhost:5173
```

| Script         | What it does                               |
|----------------|--------------------------------------------|
| `pnpm dev`     | Vite dev server with hot reload            |
| `pnpm build`   | Production build → `dist/`                 |
| `pnpm preview` | Preview the built site locally             |
| `pnpm lint`    | ESLint (strict TS + Tailwind rules)        |
| `pnpm test`    | Vitest + RTL unit tests                    |

---

## 🔑 Environment variables

`.env` uses `dotenv` format:

```
VITE_MAPBOX_TOKEN=pk_xxxxxxxxxxxxxxxxxxxxxxxxx
VITE_OPENWEATHER_KEY=xxxxxxxxxxxxxxxxxxxxxxxxx
```

- **Mapbox token** → grab one at [mapbox.com](https://account.mapbox.com)  
- **OpenWeather key** → create one at [openweathermap.org](https://home.openweathermap.org/api_keys)  

These keys stay local in your `.env` file.

---

## ⚙️ Tech stack

- **React 19 + Vite**
- **TypeScript (strict)**
- `react-map-gl` v8 → Mapbox GL in React
- Mapbox Search API v6 (autocomplete + reverse geocode)
- OpenWeather One Call 3.0 (current + hourly + daily)
- **TanStack Query 5** (caching / retries)
- **Tailwind 4 + shadcn/ui** (minimal styling)
