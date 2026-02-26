import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { HourlyForecast } from '../../models/weather.model';
import { SettingsService } from '../../services/settings.service';

@Component({
    selector: 'app-hourly-forecast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './hourly-forecast.html',
    styleUrl: './hourly-forecast.css'
})
export class HourlyForecastComponent implements OnInit, OnDestroy {
    @Input() hourly: HourlyForecast[] = [];
    unit: 'C' | 'F' = 'C';
    private sub!: Subscription;

    constructor(public settings: SettingsService) { }

    ngOnInit(): void {
        this.sub = this.settings.unit$.subscribe(u => this.unit = u);
    }

    ngOnDestroy(): void { this.sub?.unsubscribe(); }

    getTemp(c: number): number { return this.settings.convert(c); }

    getIcon(code: string): string {
        const icons: Record<string, string> = {
            'sunny': '☀️', 'partly-cloudy': '⛅', 'cloudy': '☁️',
            'rainy': '🌧️', 'stormy': '⛈️', 'snowy': '🌨️'
        };
        return icons[code] ?? '🌡️';
    }
}
