import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchService } from '../services/search.service';
import { WeatherService } from '../services/weather.service';
import { SettingsService } from '../services/settings.service';
import { FavouritesService } from '../services/favourites.service';
import { HistoryService } from '../services/history.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  searchQuery = '';
  allCities: string[] = [];
  filteredCities: string[] = [];
  showDropdown = false;
  unit: 'C' | 'F' = 'C';
  theme: 'dark' | 'light' = 'dark';
  history: string[] = [];
  favourites: string[] = [];
  showHistoryBar = false;
  locating = false;

  private subs = new Subscription();

  constructor(
    private searchService: SearchService,
    private weatherService: WeatherService,
    public settings: SettingsService,
    public favService: FavouritesService,
    private histService: HistoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.allCities = this.weatherService.getCities();
    this.searchQuery = this.searchService.getCurrentCity();
    this.subs.add(this.settings.unit$.subscribe(u => this.unit = u));
    this.subs.add(this.settings.theme$.subscribe(t => this.theme = t));
    this.subs.add(this.histService.history$.subscribe(h => this.history = h));
    this.subs.add(this.favService.favourites$.subscribe(f => this.favourites = f));
    this.subs.add(this.searchService.city$.subscribe(c => this.searchQuery = c));
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }

  onInput(): void {
    const q = this.searchQuery.trim().toLowerCase();
    this.filteredCities = q ? this.allCities.filter(c => c.toLowerCase().includes(q)) : [];
    this.showDropdown = this.filteredCities.length > 0;
  }

  selectCity(city: string): void {
    this.searchQuery = city;
    this.showDropdown = false;
    this.navigate(city);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.showDropdown = false;
      this.navigate(this.searchQuery.trim());
    }
  }

  hideDropdown(): void { setTimeout(() => { this.showDropdown = false; }, 200); }

  navigate(city: string): void {
    this.router.navigate(['/weather', city]);
  }

  toggleUnit(): void { this.settings.toggleUnit(); }
  toggleTheme(): void { this.settings.toggleTheme(); }

  useLocation(): void {
    if (!navigator.geolocation) return;
    this.locating = true;
    navigator.geolocation.getCurrentPosition(
      pos => {
        const city = this.weatherService.getNearestCity(pos.coords.latitude, pos.coords.longitude);
        this.locating = false;
        this.navigate(city);
      },
      () => { this.locating = false; }
    );
  }

  clearHistory(): void { this.histService.clear(); }
}
