import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistoryService {
    private readonly KEY = 'wc_history';
    private readonly MAX = 5;
    private histSubject = new BehaviorSubject<string[]>(this.load());

    history$ = this.histSubject.asObservable();

    private load(): string[] {
        try { return JSON.parse(localStorage.getItem(this.KEY) ?? '[]'); }
        catch { return []; }
    }

    private save(cities: string[]): void {
        localStorage.setItem(this.KEY, JSON.stringify(cities));
        this.histSubject.next(cities);
    }

    add(city: string): void {
        const current = this.histSubject.getValue().filter(c => c !== city);
        const updated = [city, ...current].slice(0, this.MAX);
        this.save(updated);
    }

    clear(): void {
        this.save([]);
    }

    getAll(): string[] {
        return this.histSubject.getValue();
    }
}
