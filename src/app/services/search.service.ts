import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
    private citySubject = new BehaviorSubject<string>('London');
    city$ = this.citySubject.asObservable();

    setCity(city: string): void {
        this.citySubject.next(city);
    }

    getCurrentCity(): string {
        return this.citySubject.getValue();
    }
}
