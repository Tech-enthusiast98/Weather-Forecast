import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { CityExplorerComponent } from './components/city-explorer/city-explorer';

export const routes: Routes = [
    { path: '', redirectTo: 'weather/London', pathMatch: 'full' },
    { path: 'weather/:city', component: HomeComponent },
    { path: 'explore', component: CityExplorerComponent },
    { path: '**', redirectTo: 'weather/London' }
];
