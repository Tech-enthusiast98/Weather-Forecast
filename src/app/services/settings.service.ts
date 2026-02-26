import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    private readonly UNIT_KEY = 'wc_unit';
    private readonly THEME_KEY = 'wc_theme';

    private unitSubject = new BehaviorSubject<'C' | 'F'>(
        (localStorage.getItem(this.UNIT_KEY) as 'C' | 'F') ?? 'C'
    );
    private themeSubject = new BehaviorSubject<'dark' | 'light'>(
        (localStorage.getItem(this.THEME_KEY) as 'dark' | 'light') ?? 'dark'
    );

    unit$ = this.unitSubject.asObservable();
    theme$ = this.themeSubject.asObservable();

    constructor() {
        this.applyTheme(this.themeSubject.getValue());
    }

    getUnit(): 'C' | 'F' { return this.unitSubject.getValue(); }
    getTheme(): 'dark' | 'light' { return this.themeSubject.getValue(); }

    toggleUnit(): void {
        const next: 'C' | 'F' = this.getUnit() === 'C' ? 'F' : 'C';
        localStorage.setItem(this.UNIT_KEY, next);
        this.unitSubject.next(next);
    }

    toggleTheme(): void {
        const next: 'dark' | 'light' = this.getTheme() === 'dark' ? 'light' : 'dark';
        localStorage.setItem(this.THEME_KEY, next);
        this.themeSubject.next(next);
        this.applyTheme(next);
    }

    /** Convert Celsius value based on current unit */
    convert(celsius: number): number {
        return this.getUnit() === 'F' ? Math.round(celsius * 9 / 5 + 32) : celsius;
    }

    private applyTheme(theme: 'dark' | 'light'): void {
        document.body.setAttribute('data-theme', theme);
    }
}
