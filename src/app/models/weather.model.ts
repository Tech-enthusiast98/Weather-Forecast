export interface CurrentWeather {
    city: string;
    country: string;
    countryEmoji: string;
    temperature: number;
    feelsLike: number;
    humidity: number;
    condition: string;
    conditionCode: string; // e.g. 'sunny', 'cloudy', 'rainy', 'snowy', 'stormy', 'partly-cloudy'
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
    date: string;       // e.g. 'Mon', 'Tue'
    fullDate: string;
    high: number;
    low: number;
    condition: string;
    conditionCode: string;
    rainProbability: number;
}

export interface WeatherData {
    current: CurrentWeather;
    forecast: DailyForecast[];
}
