import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentWeather } from '../../models/weather.model';

@Component({
    selector: 'app-sun-times',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sun-times.html',
    styleUrl: './sun-times.css'
})
export class SunTimesComponent implements OnChanges {
    @Input() weather!: CurrentWeather;

    sunProgress = 50; // 0–100 percent across the arc

    ngOnChanges(): void {
        this.sunProgress = this.calcProgress();
    }

    private parseTime(t: string): number {
        const [timePart, period] = t.split(' ');
        let [h, m] = timePart.split(':').map(Number);
        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        return h * 60 + m;
    }

    private calcProgress(): number {
        const now = new Date();
        const nowMin = now.getHours() * 60 + now.getMinutes();
        const rise = this.parseTime(this.weather.sunrise);
        const set = this.parseTime(this.weather.sunset);
        if (nowMin <= rise) return 0;
        if (nowMin >= set) return 100;
        return Math.round(((nowMin - rise) / (set - rise)) * 100);
    }

    get sunX(): number {
        // Map 0-100 to x position along a 300-wide arc
        const t = this.sunProgress / 100;
        return 10 + t * 280;
    }

    get sunY(): number {
        // Arc: parabola — highest at middle (t=0.5 → y = 10), lowest at edges (y = 100)
        const t = this.sunProgress / 100;
        return 100 - 90 * (1 - Math.pow((t - 0.5) * 2, 2));
    }
}
