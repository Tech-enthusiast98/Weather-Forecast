import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavouritesService {
    private readonly KEY = 'wc_favourites';
    private favSubject = new BehaviorSubject<string[]>(this.load());

    favourites$ = this.favSubject.asObservable();

    private load(): string[] {
        try { return JSON.parse(localStorage.getItem(this.KEY) ?? '[]'); }
        catch { return []; }
    }

    private save(cities: string[]): void {
        localStorage.setItem(this.KEY, JSON.stringify(cities));
        this.favSubject.next(cities);
    }

    isFavourite(city: string): boolean {
        return this.favSubject.getValue().includes(city);
    }

    toggle(city: string): void {
        const current = this.favSubject.getValue();
        const updated = current.includes(city)
            ? current.filter(c => c !== city)
            : [...current, city];
        this.save(updated);
    }

    getAll(): string[] {
        return this.favSubject.getValue();
    }
}
