import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentWeather } from '../../models/weather.model';

interface CityPin {
    name: string;
    x: number;
    y: number;
}

const CITY_COORDS: Record<string, { x: number, y: number }> = {
    'London': { x: 47, y: 22 },
    'Paris': { x: 49, y: 25 },
    'Berlin': { x: 52, y: 22 },
    'New York': { x: 22, y: 28 },
    'Toronto': { x: 21, y: 24 },
    'Mumbai': { x: 64, y: 40 },
    'Dubai': { x: 60, y: 35 },
    'Tokyo': { x: 80, y: 27 },
    'Singapore': { x: 75, y: 47 },
    'Sydney': { x: 82, y: 65 },
};

@Component({
    selector: 'app-climate-map',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './climate-map.html',
    styleUrl: './climate-map.css'
})
export class ClimateMapComponent {
    @Input() weather!: CurrentWeather;

    get pinX(): number {
        return CITY_COORDS[this.weather?.city]?.x ?? 50;
    }

    get pinY(): number {
        return CITY_COORDS[this.weather?.city]?.y ?? 50;
    }

    get allPins(): CityPin[] {
        return Object.entries(CITY_COORDS).map(([name, coords]) => ({
            name, x: coords.x, y: coords.y
        }));
    }
}
