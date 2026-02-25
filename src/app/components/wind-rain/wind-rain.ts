import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentWeather } from '../../models/weather.model';

@Component({
    selector: 'app-wind-rain',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './wind-rain.html',
    styleUrl: './wind-rain.css'
})
export class WindRainComponent {
    @Input() weather!: CurrentWeather;

    get arrowStyle(): Record<string, string> {
        return { transform: `rotate(${this.weather.windDegree}deg)` };
    }

    getRainLabel(pct: number): string {
        if (pct < 20) return 'Very Low';
        if (pct < 40) return 'Low';
        if (pct < 60) return 'Moderate';
        if (pct < 80) return 'High';
        return 'Very High';
    }
}
