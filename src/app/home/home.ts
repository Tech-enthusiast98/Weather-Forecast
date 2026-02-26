import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WeatherService } from '../services/weather.service';
import { SearchService } from '../services/search.service';
import { HistoryService } from '../services/history.service';
import { FavouritesService } from '../services/favourites.service';
import { WeatherData, WeatherAlert } from '../models/weather.model';
import { CurrentWeatherComponent } from '../components/current-weather/current-weather';
import { WindRainComponent } from '../components/wind-rain/wind-rain';
import { SunTimesComponent } from '../components/sun-times/sun-times';
import { ForecastComponent } from '../components/forecast/forecast';
import { ClimateMapComponent } from '../components/climate-map/climate-map';
import { HourlyForecastComponent } from '../components/hourly-forecast/hourly-forecast';
import { AqiPanelComponent } from '../components/aqi-panel/aqi-panel';
import { HistoricalChartComponent } from '../components/historical-chart/historical-chart';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CurrentWeatherComponent, WindRainComponent, SunTimesComponent,
    ForecastComponent, ClimateMapComponent, HourlyForecastComponent,
    AqiPanelComponent, HistoricalChartComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  weatherData: WeatherData | null = null;
  loading = false;
  notFound = false;
  currentCity = '';
  dismissedAlerts = new Set<string>();
  private subs = new Subscription();

  constructor(
    private weatherService: WeatherService,
    private searchService: SearchService,
    private historyService: HistoryService,
    public favService: FavouritesService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Read snapshot immediately for first load
    const snapCity = this.route.snapshot.paramMap.get('city') || 'London';
    this.currentCity = snapCity;
    this.fetchWeather(snapCity);

    // Also subscribe for subsequent navigation within the same route
    this.subs.add(
      this.route.paramMap.subscribe(params => {
        const city = params.get('city') || 'London';
        if (city !== this.currentCity) {
          this.currentCity = city;
          this.fetchWeather(city);
        }
      })
    );
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }

  fetchWeather(city: string): void {
    this.loading = true;
    this.notFound = false;
    this.dismissedAlerts.clear();
    this.weatherService.getWeather(city).subscribe({
      next: (data) => {
        this.loading = false;
        if (data) {
          this.weatherData = data;
          this.currentCity = data.current.city;
          this.historyService.add(data.current.city);
          this.searchService.setCity(data.current.city);
          this.applyBackground(data.current.conditionCode);
        } else {
          this.weatherData = null;
          this.notFound = true;
          this.applyBackground('');
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.weatherData = null;
        this.notFound = true;
        this.cdr.detectChanges();
      }
    });
  }

  get visibleAlerts(): WeatherAlert[] {
    return (this.weatherData?.alerts ?? []).filter(a => !this.dismissedAlerts.has(a.id));
  }

  dismissAlert(id: string): void { this.dismissedAlerts.add(id); }

  toggleFav(): void {
    if (this.weatherData) this.favService.toggle(this.weatherData.current.city);
  }

  isFav(): boolean {
    return !!this.weatherData && this.favService.isFavourite(this.weatherData.current.city);
  }

  private applyBackground(code: string): void {
    const classes = ['bg-sunny', 'bg-cloudy', 'bg-rainy', 'bg-stormy', 'bg-snowy', 'bg-partly-cloudy'];
    document.body.classList.remove(...classes);
    if (code) document.body.classList.add(`bg-${code}`);
  }
}
