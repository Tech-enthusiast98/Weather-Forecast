import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../services/search.service';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  searchQuery = '';
  allCities: string[] = [];
  filteredCities: string[] = [];
  showDropdown = false;

  constructor(
    private searchService: SearchService,
    private weatherService: WeatherService
  ) { }

  ngOnInit(): void {
    this.allCities = this.weatherService.getCities();
    this.searchQuery = this.searchService.getCurrentCity();
  }

  onInput(): void {
    const q = this.searchQuery.trim().toLowerCase();
    this.filteredCities = q
      ? this.allCities.filter(c => c.toLowerCase().includes(q))
      : [];
    this.showDropdown = this.filteredCities.length > 0;
  }

  selectCity(city: string): void {
    this.searchQuery = city;
    this.showDropdown = false;
    this.searchService.setCity(city);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.showDropdown = false;
      this.searchService.setCity(this.searchQuery.trim());
    }
  }

  hideDropdown(): void {
    setTimeout(() => { this.showDropdown = false; }, 200);
  }
}
