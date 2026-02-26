# WeatherCast – Weather Forecast App Walkthrough

## What Was Built

A fully-featured **Weather Forecast Angular Application** with a premium dark glassmorphism design, delivering all required features using **mock data** (no API key needed).

---

## Features Delivered

| Feature | Status |
|---|---|
| City search with autocomplete | ✅ |
| Current weather (temp, humidity, UV, pressure, visibility) | ✅ |
| Wind speed, direction & compass widget | ✅ |
| Rain probability animated bar | ✅ |
| Sunrise & sunset SVG arc with day progress % | ✅ |
| 5-day forecast strip with icons, high/low temps | ✅ |
| SVG climate map with pulsing city pin | ✅ |
| "City not found" error state | ✅ |
| Responsive design (mobile + desktop) | ✅ |
| Loading spinner for async feel | ✅ |
| Fuzzy city search matching | ✅ |

---

## Architecture

```
src/app/
├── models/
│   └── weather.model.ts          ← TypeScript interfaces
├── services/
│   ├── weather.service.ts        ← Mock data for 10 cities + fuzzy search
│   └── search.service.ts         ← BehaviorSubject city stream
├── navbar/                       ← Search box + autocomplete dropdown
├── home/                         ← Dashboard orchestrator
└── components/
    ├── current-weather/          ← Main weather card
    ├── wind-rain/                ← Compass widget + rain probability bar
    ├── sun-times/                ← Animated SVG arc (sunrise → sunset)
    ├── forecast/                 ← 5-day forecast strip
    └── climate-map/              ← SVG world map + pulsing city pin
```

---

## Available Cities

| City | Country | Climate |
|------|---------|---------|
| London | 🇬🇧 United Kingdom | Temperate Oceanic |
| Tokyo | 🇯🇵 Japan | Humid Subtropical |
| Mumbai | 🇮🇳 India | Tropical Wet & Dry |
| New York | 🇺🇸 United States | Humid Continental |
| Paris | 🇫🇷 France | Oceanic Climate |
| Dubai | 🇦🇪 UAE | Hot Desert |
| Sydney | 🇦🇺 Australia | Humid Subtropical |
| Berlin | 🇩🇪 Germany | Humid Continental |
| Toronto | 🇨🇦 Canada | Humid Continental |
| Singapore | 🇸🇬 Singapore | Tropical Rainforest |

---

## Technologies Used

- **Angular 21** (standalone components)
- **TypeScript**
- **Bootstrap 5** (grid & utilities)
- **Bootstrap Icons**
- **RxJS** (BehaviorSubject, Observable, delay)
- **Vanilla CSS** (glassmorphism, animations, SVG)
- **Google Fonts** (Inter)

---

## How to Run

```bash
# Install dependencies
npm install

# Start dev server
ng serve

# Open browser
# Navigate to http://localhost:4200
```

## How to Use

1. The app loads with **London** weather by default
2. Type any city name in the search bar (e.g. `Mumbai`, `Tokyo`, `Dubai`)
3. Select from the autocomplete dropdown or press **Enter**
4. All panels update dynamically with the city's weather data
5. Try an unknown city to see the friendly "City Not Found" message

---

## Bug Fix: Mumbai Search

The initial version had a strict exact-key match in `WeatherService.getWeather()`. This was fixed by adding **fuzzy matching** as a fallback — searches like `"mum"`, `"MUMBAI"`, or `"Mumb"` all correctly resolve to Mumbai's data.

```typescript
// Fuzzy fallback if exact key not found
const matchedKey = Object.keys(MOCK_DATA).find(k =>
  k.includes(key) || key.includes(k)
);
```
