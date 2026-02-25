import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentWeather } from '../../models/weather.model';

@Component({
    selector: 'app-current-weather',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './current-weather.html',
    styleUrl: './current-weather.css'
})
export class CurrentWeatherComponent {
    @Input() weather!: CurrentWeather;

    getConditionIcon(code: string): string {
        const icons: Record<string, string> = {
            'sunny': '☀️',
            'partly-cloudy': '⛅',
            'cloudy': '☁️',
            'rainy': '🌧️',
            'stormy': '⛈️',
            'snowy': '🌨️',
        };
        return icons[code] ?? '🌡️';
    }

    getUvLabel(uv: number): string {
        if (uv <= 2) return 'Low';
        if (uv <= 5) return 'Moderate';
        if (uv <= 7) return 'High';
        if (uv <= 10) return 'Very High';
        return 'Extreme';
    }
}
