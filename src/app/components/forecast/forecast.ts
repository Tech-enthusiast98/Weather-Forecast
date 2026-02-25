import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyForecast } from '../../models/weather.model';

@Component({
    selector: 'app-forecast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './forecast.html',
    styleUrl: './forecast.css'
})
export class ForecastComponent {
    @Input() forecast: DailyForecast[] = [];

    getIcon(code: string): string {
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
}
