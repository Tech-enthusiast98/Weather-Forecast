import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { WeatherService } from '../services/weather.service';
import { SearchService } from '../services/search.service';
import { WeatherData } from '../models/weather.model';
import { CurrentWeatherComponent } from '../components/current-weather/current-weather';
import { WindRainComponent } from '../components/wind-rain/wind-rain';
import { SunTimesComponent } from '../components/sun-times/sun-times';
import { ForecastComponent } from '../components/forecast/forecast';
import { ClimateMapComponent } from '../components/climate-map/climate-map';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CurrentWeatherComponent,
    WindRainComponent,
    SunTimesComponent,
    ForecastComponent,
    ClimateMapComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  weatherData: WeatherData | null = null;
  loading = false;
  notFound = false;
  private sub!: Subscription;

  constructor(
    private weatherService: WeatherService,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.sub = this.searchService.city$.subscribe(city => {
      this.fetchWeather(city);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  fetchWeather(city: string): void {
    this.loading = true;
    this.notFound = false;
    this.weatherService.getWeather(city).subscribe(data => {
      this.loading = false;
      if (data) {
        this.weatherData = data;
        this.notFound = false;
      } else {
        this.weatherData = null;
        this.notFound = true;
      }
    });
  }
}
