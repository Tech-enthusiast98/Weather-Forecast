export interface CurrentWeather {
    city: string;
    country: string;
    countryEmoji: string;
    temperature: number;
    feelsLike: number;
    humidity: number;
    condition: string;
    conditionCode: string;
    windSpeed: number;
    windDirection: string;
    windDegree: number;
    uvIndex: number;
    visibility: number;
    pressure: number;
    sunrise: string;
    sunset: string;
    rainProbability: number;
    climateType: string;
    latitude: number;
    longitude: number;
}

export interface DailyForecast {
    date: string;
    fullDate: string;
    high: number;
    low: number;
    condition: string;
    conditionCode: string;
    rainProbability: number;
}

export interface HourlyForecast {
    hour: string;       // e.g. '14:00'
    temp: number;
    conditionCode: string;
    rainProbability: number;
    isNow?: boolean;
}

export interface AirQuality {
    aqi: number;        // 0–500
    pm25: number;
    co2: number;
    ozone: number;
    label: 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
    color: string;      // CSS color for badge
}

export interface WeatherAlert {
    id: string;
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'danger';
}

export interface HistoricalDay {
    date: string;       // short label e.g. 'Feb 19'
    high: number;
    low: number;
}

export interface WeatherData {
    current: CurrentWeather;
    forecast: DailyForecast[];
    hourly: HourlyForecast[];
    airQuality: AirQuality;
    alerts: WeatherAlert[];
    historical: HistoricalDay[];
}
