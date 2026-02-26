import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirQuality } from '../../models/weather.model';

@Component({
    selector: 'app-aqi-panel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './aqi-panel.html',
    styleUrl: './aqi-panel.css'
})
export class AqiPanelComponent {
    @Input() airQuality!: AirQuality;

    get aqiPercent(): number {
        return Math.min(100, Math.round((this.airQuality.aqi / 300) * 100));
    }

    getBarColor(value: number, max: number): string {
        const pct = value / max;
        if (pct < 0.3) return '#22c55e';
        if (pct < 0.6) return '#eab308';
        return '#ef4444';
    }
}
