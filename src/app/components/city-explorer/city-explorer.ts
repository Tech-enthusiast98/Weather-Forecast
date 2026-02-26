import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WeatherService } from '../../services/weather.service';
import { FavouritesService } from '../../services/favourites.service';
import { SettingsService } from '../../services/settings.service';
import { WeatherData } from '../../models/weather.model';

@Component({
    selector: 'app-city-explorer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './city-explorer.html',
    styleUrl: './city-explorer.css'
})
export class CityExplorerComponent implements OnInit {
    cities: { city: string; data: WeatherData }[] = [];

    constructor(
        private weatherService: WeatherService,
        public favService: FavouritesService,
        public settings: SettingsService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.cities = this.weatherService.getAllCityPreviews();
    }

    navigate(city: string): void {
        this.router.navigate(['/weather', city]);
    }

    toggleFav(event: Event, city: string): void {
        event.stopPropagation();
        this.favService.toggle(city);
    }

    getIcon(code: string): string {
        const icons: Record<string, string> = {
            'sunny': '☀️', 'partly-cloudy': '⛅', 'cloudy': '☁️',
            'rainy': '🌧️', 'stormy': '⛈️', 'snowy': '🌨️'
        };
        return icons[code] ?? '🌡️';
    }

    getTemp(c: number): number { return this.settings.convert(c); }
}
