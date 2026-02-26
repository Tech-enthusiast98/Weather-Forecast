import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CurrentWeather } from '../../models/weather.model';
import { SettingsService } from '../../services/settings.service';

@Component({
    selector: 'app-current-weather',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './current-weather.html',
    styleUrl: './current-weather.css'
})
export class CurrentWeatherComponent implements OnInit, OnDestroy {
    @Input() weather!: CurrentWeather;
    unit: 'C' | 'F' = 'C';
    private sub!: Subscription;

    constructor(public settings: SettingsService) { }

    ngOnInit(): void {
        this.sub = this.settings.unit$.subscribe(u => this.unit = u);
    }

    ngOnDestroy(): void { this.sub?.unsubscribe(); }

    getTemp(c: number): number { return this.settings.convert(c); }

    getConditionIcon(code: string): string {
        const icons: Record<string, string> = {
            'sunny': '☀️', 'partly-cloudy': '⛅', 'cloudy': '☁️',
            'rainy': '🌧️', 'stormy': '⛈️', 'snowy': '🌨️',
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

    getHumidityOffset(): number {
        // SVG circle circumference = 2π×36 ≈ 226; offset = (1 - pct) * 226
        return 226 - (this.weather.humidity / 100) * 226;
    }

    getUvOffset(): number {
        return 226 - (Math.min(this.weather.uvIndex, 11) / 11) * 226;
    }
}
