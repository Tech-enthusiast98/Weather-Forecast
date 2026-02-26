import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { WeatherData, HourlyForecast, AirQuality, WeatherAlert, HistoricalDay } from '../models/weather.model';

// Helper to build 24-hour mock data
function makeHourly(baseTemp: number, conditionCode: string, rainProb: number): HourlyForecast[] {
    const codes = ['sunny', 'partly-cloudy', conditionCode];
    const now = new Date().getHours();
    return Array.from({ length: 24 }, (_, i) => ({
        hour: `${String(i).padStart(2, '0')}:00`,
        temp: baseTemp + Math.round(Math.sin((i - 6) * Math.PI / 12) * 5),
        conditionCode: i < 6 || i > 20 ? 'cloudy' : codes[i % 3],
        rainProbability: i > 14 && i < 20 ? rainProb : Math.max(0, rainProb - 20),
        isNow: i === now
    }));
}

function makeHistorical(baseHigh: number, baseLow: number): HistoricalDay[] {
    const labels = ['Feb 19', 'Feb 20', 'Feb 21', 'Feb 22', 'Feb 23', 'Feb 24', 'Feb 25'];
    return labels.map((date, i) => ({
        date,
        high: baseHigh + Math.round((Math.random() - 0.5) * 4),
        low: baseLow + Math.round((Math.random() - 0.5) * 3)
    }));
}

const MOCK_DATA: Record<string, WeatherData> = {
    london: {
        current: {
            city: 'London', country: 'United Kingdom', countryEmoji: '🇬🇧',
            temperature: 12, feelsLike: 9, humidity: 78,
            condition: 'Partly Cloudy', conditionCode: 'partly-cloudy',
            windSpeed: 22, windDirection: 'SW', windDegree: 225,
            uvIndex: 2, visibility: 10, pressure: 1013,
            sunrise: '07:14 AM', sunset: '05:48 PM',
            rainProbability: 45, climateType: 'Temperate Oceanic',
            latitude: 51.5, longitude: -0.12
        },
        forecast: [
            { date: 'Today', fullDate: 'Tue, Feb 25', high: 13, low: 7, condition: 'Partly Cloudy', conditionCode: 'partly-cloudy', rainProbability: 45 },
            { date: 'Wed', fullDate: 'Wed, Feb 26', high: 11, low: 6, condition: 'Rainy', conditionCode: 'rainy', rainProbability: 80 },
            { date: 'Thu', fullDate: 'Thu, Feb 27', high: 10, low: 5, condition: 'Stormy', conditionCode: 'stormy', rainProbability: 90 },
            { date: 'Fri', fullDate: 'Fri, Feb 28', high: 12, low: 7, condition: 'Cloudy', conditionCode: 'cloudy', rainProbability: 60 },
            { date: 'Sat', fullDate: 'Sat, Mar 01', high: 15, low: 9, condition: 'Sunny', conditionCode: 'sunny', rainProbability: 10 },
        ],
        hourly: makeHourly(12, 'partly-cloudy', 45),
        airQuality: { aqi: 42, pm25: 8.2, co2: 410, ozone: 32, label: 'Good', color: '#22c55e' },
        alerts: [],
        historical: makeHistorical(13, 7)
    },

    tokyo: {
        current: {
            city: 'Tokyo', country: 'Japan', countryEmoji: '🇯🇵',
            temperature: 8, feelsLike: 5, humidity: 60,
            condition: 'Clear Sky', conditionCode: 'sunny',
            windSpeed: 15, windDirection: 'N', windDegree: 0,
            uvIndex: 3, visibility: 15, pressure: 1022,
            sunrise: '06:18 AM', sunset: '05:42 PM',
            rainProbability: 10, climateType: 'Humid Subtropical',
            latitude: 35.68, longitude: 139.69
        },
        forecast: [
            { date: 'Today', fullDate: 'Tue, Feb 25', high: 9, low: 3, condition: 'Sunny', conditionCode: 'sunny', rainProbability: 10 },
            { date: 'Wed', fullDate: 'Wed, Feb 26', high: 11, low: 5, condition: 'Partly Cloudy', conditionCode: 'partly-cloudy', rainProbability: 20 },
            { date: 'Thu', fullDate: 'Thu, Feb 27', high: 13, low: 6, condition: 'Sunny', conditionCode: 'sunny', rainProbability: 5 },
            { date: 'Fri', fullDate: 'Fri, Feb 28', high: 10, low: 4, condition: 'Cloudy', conditionCode: 'cloudy', rainProbability: 35 },
            { date: 'Sat', fullDate: 'Sat, Mar 01', high: 8, low: 2, condition: 'Rainy', conditionCode: 'rainy', rainProbability: 70 },
        ],
        hourly: makeHourly(8, 'sunny', 10),
        airQuality: { aqi: 58, pm25: 12.1, co2: 415, ozone: 28, label: 'Moderate', color: '#eab308' },
        alerts: [],
        historical: makeHistorical(9, 3)
    },

    mumbai: {
        current: {
            city: 'Mumbai', country: 'India', countryEmoji: '🇮🇳',
            temperature: 32, feelsLike: 36, humidity: 85,
            condition: 'Hazy Sunshine', conditionCode: 'sunny',
            windSpeed: 18, windDirection: 'W', windDegree: 270,
            uvIndex: 9, visibility: 7, pressure: 1008,
            sunrise: '06:48 AM', sunset: '06:38 PM',
            rainProbability: 20, climateType: 'Tropical Wet & Dry',
            latitude: 19.07, longitude: 72.87
        },
        forecast: [
            { date: 'Today', fullDate: 'Tue, Feb 25', high: 33, low: 25, condition: 'Sunny', conditionCode: 'sunny', rainProbability: 20 },
            { date: 'Wed', fullDate: 'Wed, Feb 26', high: 34, low: 26, condition: 'Sunny', conditionCode: 'sunny', rainProbability: 15 },
            { date: 'Thu', fullDate: 'Thu, Feb 27', high: 33, low: 25, condition: 'Partly Cloudy', conditionCode: 'partly-cloudy', rainProbability: 30 },
            { date: 'Fri', fullDate: 'Fri, Feb 28', high: 31, low: 24, condition: 'Cloudy', conditionCode: 'cloudy', rainProbability: 50 },
            { date: 'Sat', fullDate: 'Sat, Mar 01', high: 30, low: 24, condition: 'Rainy', conditionCode: 'rainy', rainProbability: 75 },
        ],
        hourly: makeHourly(32, 'sunny', 20),
        airQuality: { aqi: 158, pm25: 55.3, co2: 438, ozone: 44, label: 'Unhealthy', color: '#ef4444' },
        alerts: [
            { id: 'a1', title: '🌡️ Heat Advisory', message: 'Feels like 36°C. Stay hydrated and avoid outdoor activity between 11am–4pm.', severity: 'warning' }
        ],
        historical: makeHistorical(33, 25)
    },

    'new york': {
        current: {
            city: 'New York', country: 'United States', countryEmoji: '🇺🇸',
            temperature: 3, feelsLike: -2, humidity: 55,
            condition: 'Snowy', conditionCode: 'snowy',
            windSpeed: 30, windDirection: 'NW', windDegree: 315,
            uvIndex: 1, visibility: 5, pressure: 1005,
            sunrise: '06:38 AM', sunset: '05:55 PM',
            rainProbability: 70, climateType: 'Humid Continental',
            latitude: 40.71, longitude: -74.0
        },
        forecast: [
            { date: 'Today', fullDate: 'Tue, Feb 25', high: 4, low: -1, condition: 'Snowy', conditionCode: 'snowy', rainProbability: 70 },
            { date: 'Wed', fullDate: 'Wed, Feb 26', high: 6, low: 1, condition: 'Cloudy', conditionCode: 'cloudy', rainProbability: 40 },
            { date: 'Thu', fullDate: 'Thu, Feb 27', high: 9, low: 3, condition: 'Partly Cloudy', conditionCode: 'partly-cloudy', rainProbability: 20 },
            { date: 'Fri', fullDate: 'Fri, Feb 28', high: 11, low: 5, condition: 'Sunny', conditionCode: 'sunny', rainProbability: 10 },
            { date: 'Sat', fullDate: 'Sat, Mar 01', high: 8, low: 2, condition: 'Rainy', conditionCode: 'rainy', rainProbability: 60 },
        ],
        hourly: makeHourly(3, 'snowy', 70),
        airQuality: { aqi: 72, pm25: 18.4, co2: 420, ozone: 38, label: 'Moderate', color: '#eab308' },
        alerts: [
            { id: 'b1', title: '❄️ Winter Storm Warning', message: 'Heavy snowfall expected. 4–6 inches predicted by midnight. Avoid non-essential travel.', severity: 'danger' }
        ],
        historical: makeHistorical(4, -1)
    },

    paris: {
        current: {
            city: 'Paris', country: 'France', countryEmoji: '🇫🇷',
            temperature: 10, feelsLike: 7, humidity: 72,
            condition: 'Overcast', conditionCode: 'cloudy',
            windSpeed: 20, windDirection: 'W', windDegree: 270,
            uvIndex: 2, visibility: 9, pressure: 1015,
            sunrise: '07:38 AM', sunset: '06:10 PM',
            rainProbability: 55, climateType: 'Oceanic Climate',
            latitude: 48.85, longitude: 2.35
        },
        forecast: [
            { date: 'Today', fullDate: 'Tue, Feb 25', high: 11, low: 6, condition: 'Cloudy', conditionCode: 'cloudy', rainProbability: 55 },
            { date: 'Wed', fullDate: 'Wed, Feb 26', high: 9, low: 5, condition: 'Rainy', conditionCode: 'rainy', rainProbability: 75 },
            { date: 'Thu', fullDate: 'Thu, Feb 27', high: 12, low: 7, condition: 'Partly Cloudy', conditionCode: 'partly-cloudy', rainProbability: 30 },
            { date: 'Fri', fullDate: 'Fri, Feb 28', high: 14, low: 8, condition: 'Sunny', conditionCode: 'sunny', rainProbability: 15 },
            { date: 'Sat', fullDate: 'Sat, Mar 01', high: 13, low: 7, condition: 'Partly Cloudy', conditionCode: 'partly-cloudy', rainProbability: 25 },
        ],
        hourly: makeHourly(10, 'cloudy', 55),
        airQuality: { aqi: 48, pm25: 9.8, co2: 412, ozone: 31, label: 'Good', color: '#22c55e' },
        alerts: [],
        historical: makeHistorical(11, 6)
    },

    dubai: {
        current: {
            city: 'Dubai', country: 'UAE', countryEmoji: '🇦🇪',
            temperature: 28, feelsLike: 30, humidity: 55,
            condition: 'Sunny', conditionCode: 'sunny',
            windSpeed: 16, windDirection: 'NE', windDegree: 45,
            uvIndex: 8, visibility: 20, pressure: 1010,
            sunrise: '06:28 AM', sunset: '06:20 PM',
            rainProbability: 5, climateType: 'Hot Desert',
            latitude: 25.2, longitude: 55.27
        },
        forecast: [
            { date: 'Today', fullDate: 'Tue, Feb 25', high: 29, low: 20, condition: 'Sunny', conditionCode: 'sunny', rainProbability: 5 },
            { date: 'Wed', fullDate: 'Wed, Feb 26', high: 30, low: 21, condition: 'Sunny', conditionCode: 'sunny', rainProbability: 3 },
            { date: 'Thu', fullDate: 'Thu, Feb 27', high: 31, low: 22, condition: 'Sunny', conditionCode: 'sunny', rainProbability: 2 },
            { date: 'Fri', fullDate: 'Fri, Feb 28', high: 29, low: 20, condition: 'Partly Cloudy', conditionCode: 'partly-cloudy', rainProbability: 10 },
            { date: 'Sat', fullDate: 'Sat, Mar 01', high: 28, low: 19, condition: 'Sunny', conditionCode: 'sunny', rainProbability: 5 },
        ],
        hourly: makeHourly(28, 'sunny', 5),
        airQuality: { aqi: 88, pm25: 22.7, co2: 416, ozone: 36, label: 'Moderate', color: '#eab308' },
        alerts: [
            { id: 'c1', title: '☀️ High UV Alert', message: 'UV index reaching 8–10 today. Apply SPF 50+ sunscreen when outdoors.', severity: 'info' }
        ],
        historical: makeHistorical(29, 20)
    },

    sydney: {
        current: {
            city: 'Sydney', country: 'Australia', countryEmoji: '🇦🇺',
            temperature: 26, feelsLike: 26, humidity: 65,
            condition: 'Sunny', conditionCode: 'sunny',
            windSpeed: 20, windDirection: 'SE', windDegree: 135,
            uvIndex: 10, visibility: 18, pressure: 1018,
            sunrise: '06:05 AM', sunset: '07:45 PM',
            rainProbability: 15, climateType: 'Humid Subtropical',
            latitude: -33.87, longitude: 151.21
        },
        forecast: [
            { date: 'Today', fullDate: 'Tue, Feb 25', high: 27, low: 19, condition: 'Sunny', conditionCode: 'sunny', rainProbability: 15 },
            { date: 'Wed', fullDate: 'Wed, Feb 26', high: 28, low: 20, condition: 'Partly Cloudy', conditionCode: 'partly-cloudy', rainProbability: 20 },
            { date: 'Thu', fullDate: 'Thu, Feb 27', high: 25, low: 18, condition: 'Rainy', conditionCode: 'rainy', rainProbability: 65 },
            { date: 'Fri', fullDate: 'Fri, Feb 28', high: 23, low: 17, condition: 'Cloudy', conditionCode: 'cloudy', rainProbability: 40 },
            { date: 'Sat', fullDate: 'Sat, Mar 01', high: 26, low: 18, condition: 'Sunny', conditionCode: 'sunny', rainProbability: 10 },
        ],
        hourly: makeHourly(26, 'sunny', 15),
        airQuality: { aqi: 28, pm25: 4.1, co2: 408, ozone: 25, label: 'Good', color: '#22c55e' },
        alerts: [],
        historical: makeHistorical(27, 19)
    },

    berlin: {
        current: {
            city: 'Berlin', country: 'Germany', countryEmoji: '🇩🇪',
            temperature: 5, feelsLike: 2, humidity: 80,
            condition: 'Foggy', conditionCode: 'cloudy',
            windSpeed: 12, windDirection: 'E', windDegree: 90,
            uvIndex: 1, visibility: 4, pressure: 1020,
            sunrise: '07:15 AM', sunset: '05:52 PM',
            rainProbability: 35, climateType: 'Humid Continental',
            latitude: 52.52, longitude: 13.4
        },
        forecast: [
            { date: 'Today', fullDate: 'Tue, Feb 25', high: 6, low: 1, condition: 'Cloudy', conditionCode: 'cloudy', rainProbability: 35 },
            { date: 'Wed', fullDate: 'Wed, Feb 26', high: 7, low: 2, condition: 'Partly Cloudy', conditionCode: 'partly-cloudy', rainProbability: 25 },
            { date: 'Thu', fullDate: 'Thu, Feb 27', high: 9, low: 3, condition: 'Sunny', conditionCode: 'sunny', rainProbability: 10 },
            { date: 'Fri', fullDate: 'Fri, Feb 28', high: 8, low: 2, condition: 'Rainy', conditionCode: 'rainy', rainProbability: 60 },
            { date: 'Sat', fullDate: 'Sat, Mar 01', high: 5, low: 0, condition: 'Snowy', conditionCode: 'snowy', rainProbability: 50 },
        ],
        hourly: makeHourly(5, 'cloudy', 35),
        airQuality: { aqi: 55, pm25: 11.6, co2: 413, ozone: 30, label: 'Moderate', color: '#eab308' },
        alerts: [],
        historical: makeHistorical(6, 1)
    },

    toronto: {
        current: {
            city: 'Toronto', country: 'Canada', countryEmoji: '🇨🇦',
            temperature: -3, feelsLike: -9, humidity: 70,
            condition: 'Snowy', conditionCode: 'snowy',
            windSpeed: 35, windDirection: 'N', windDegree: 0,
            uvIndex: 1, visibility: 3, pressure: 1002,
            sunrise: '07:02 AM', sunset: '05:58 PM',
            rainProbability: 80, climateType: 'Humid Continental',
            latitude: 43.65, longitude: -79.38
        },
        forecast: [
            { date: 'Today', fullDate: 'Tue, Feb 25', high: -2, low: -8, condition: 'Snowy', conditionCode: 'snowy', rainProbability: 80 },
            { date: 'Wed', fullDate: 'Wed, Feb 26', high: 1, low: -5, condition: 'Cloudy', conditionCode: 'cloudy', rainProbability: 45 },
            { date: 'Thu', fullDate: 'Thu, Feb 27', high: 4, low: -2, condition: 'Partly Cloudy', conditionCode: 'partly-cloudy', rainProbability: 20 },
            { date: 'Fri', fullDate: 'Fri, Feb 28', high: 6, low: 0, condition: 'Sunny', conditionCode: 'sunny', rainProbability: 10 },
            { date: 'Sat', fullDate: 'Sat, Mar 01', high: 3, low: -4, condition: 'Rainy', conditionCode: 'rainy', rainProbability: 55 },
        ],
        hourly: makeHourly(-3, 'snowy', 80),
        airQuality: { aqi: 35, pm25: 6.2, co2: 409, ozone: 27, label: 'Good', color: '#22c55e' },
        alerts: [
            { id: 'd1', title: '🌨️ Blizzard Warning', message: 'Whiteout conditions possible. Wind chill −20°C. Keep emergency kit in vehicle.', severity: 'danger' }
        ],
        historical: makeHistorical(-2, -8)
    },

    singapore: {
        current: {
            city: 'Singapore', country: 'Singapore', countryEmoji: '🇸🇬',
            temperature: 30, feelsLike: 35, humidity: 88,
            condition: 'Thunderstorm', conditionCode: 'stormy',
            windSpeed: 14, windDirection: 'S', windDegree: 180,
            uvIndex: 7, visibility: 8, pressure: 1007,
            sunrise: '07:04 AM', sunset: '07:14 PM',
            rainProbability: 85, climateType: 'Tropical Rainforest',
            latitude: 1.35, longitude: 103.82
        },
        forecast: [
            { date: 'Today', fullDate: 'Tue, Feb 25', high: 31, low: 24, condition: 'Stormy', conditionCode: 'stormy', rainProbability: 85 },
            { date: 'Wed', fullDate: 'Wed, Feb 26', high: 30, low: 24, condition: 'Rainy', conditionCode: 'rainy', rainProbability: 75 },
            { date: 'Thu', fullDate: 'Thu, Feb 27', high: 31, low: 25, condition: 'Partly Cloudy', conditionCode: 'partly-cloudy', rainProbability: 40 },
            { date: 'Fri', fullDate: 'Fri, Feb 28', high: 32, low: 25, condition: 'Sunny', conditionCode: 'sunny', rainProbability: 20 },
            { date: 'Sat', fullDate: 'Sat, Mar 01', high: 30, low: 24, condition: 'Rainy', conditionCode: 'rainy', rainProbability: 70 },
        ],
        hourly: makeHourly(30, 'stormy', 85),
        airQuality: { aqi: 66, pm25: 15.2, co2: 418, ozone: 35, label: 'Moderate', color: '#eab308' },
        alerts: [
            { id: 'e1', title: '⛈️ Thunderstorm Alert', message: 'Lightning risk is high. Seek shelter immediately if outdoors. Flash flooding possible in low-lying areas.', severity: 'danger' }
        ],
        historical: makeHistorical(31, 24)
    }
};

// City geo coords for geolocation nearest-city lookup
export const CITY_GEO: Record<string, { lat: number; lon: number }> = {
    'London': { lat: 51.5, lon: -0.12 },
    'Tokyo': { lat: 35.68, lon: 139.69 },
    'Mumbai': { lat: 19.07, lon: 72.87 },
    'New York': { lat: 40.71, lon: -74.0 },
    'Paris': { lat: 48.85, lon: 2.35 },
    'Dubai': { lat: 25.2, lon: 55.27 },
    'Sydney': { lat: -33.87, lon: 151.21 },
    'Berlin': { lat: 52.52, lon: 13.4 },
    'Toronto': { lat: 43.65, lon: -79.38 },
    'Singapore': { lat: 1.35, lon: 103.82 },
};

@Injectable({ providedIn: 'root' })
export class WeatherService {
    private cities = Object.keys(MOCK_DATA).map(k => MOCK_DATA[k].current.city);

    getCities(): string[] { return this.cities; }

    getWeather(city: string): Observable<WeatherData | null> {
        const key = city.toLowerCase().trim();
        if (MOCK_DATA[key]) return of(MOCK_DATA[key]).pipe(delay(400));
        const matchedKey = Object.keys(MOCK_DATA).find(k => k.includes(key) || key.includes(k));
        return of(matchedKey ? MOCK_DATA[matchedKey] : null).pipe(delay(400));
    }

    getNearestCity(lat: number, lon: number): string {
        let nearest = 'London';
        let minDist = Infinity;
        for (const [city, coords] of Object.entries(CITY_GEO)) {
            const d = Math.sqrt(Math.pow(lat - coords.lat, 2) + Math.pow(lon - coords.lon, 2));
            if (d < minDist) { minDist = d; nearest = city; }
        }
        return nearest;
    }

    getAllCityPreviews(): { city: string; data: WeatherData }[] {
        return Object.values(MOCK_DATA).map(d => ({ city: d.current.city, data: d }));
    }
}
