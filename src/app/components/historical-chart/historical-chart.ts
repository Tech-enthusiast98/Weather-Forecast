import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { HistoricalDay } from '../../models/weather.model';
import { SettingsService } from '../../services/settings.service';

Chart.register(...registerables);

@Component({
    selector: 'app-historical-chart',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="historical-card glass-card" *ngIf="historical.length">
      <div class="section-title"><i class="bi bi-graph-up"></i> 7-Day Temperature History</div>
      <canvas #chartCanvas></canvas>
    </div>
  `,
    styleUrl: './historical-chart.css'
})
export class HistoricalChartComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() historical: HistoricalDay[] = [];
    @ViewChild('chartCanvas') canvas!: ElementRef<HTMLCanvasElement>;
    unit: 'C' | 'F' = 'C';
    private chart?: Chart;
    private sub!: Subscription;

    constructor(public settings: SettingsService) { }

    ngOnInit(): void {
        this.sub = this.settings.unit$.subscribe(u => { this.unit = u; this.updateChart(); });
    }

    ngAfterViewInit(): void { this.buildChart(); }

    ngOnDestroy(): void {
        this.chart?.destroy();
        this.sub?.unsubscribe();
    }

    private tempArr(arr: number[]): number[] {
        return this.unit === 'F' ? arr.map(t => Math.round(t * 9 / 5 + 32)) : arr;
    }

    private buildChart(): void {
        if (!this.canvas?.nativeElement || !this.historical.length) return;
        this.chart?.destroy();
        const labels = this.historical.map(d => d.date);
        this.chart = new Chart(this.canvas.nativeElement, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: `High (°${this.unit})`,
                        data: this.tempArr(this.historical.map(d => d.high)),
                        borderColor: '#f97316',
                        backgroundColor: 'rgba(249,115,22,0.1)',
                        fill: true, tension: 0.4, pointRadius: 5,
                        pointBackgroundColor: '#f97316',
                    },
                    {
                        label: `Low (°${this.unit})`,
                        data: this.tempArr(this.historical.map(d => d.low)),
                        borderColor: '#60a5fa',
                        backgroundColor: 'rgba(96,165,250,0.1)',
                        fill: true, tension: 0.4, pointRadius: 5,
                        pointBackgroundColor: '#60a5fa',
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: 'rgba(255,255,255,0.7)', font: { family: 'Inter' } } },
                    tooltip: { backgroundColor: 'rgba(10,10,30,0.9)', titleColor: '#fff', bodyColor: 'rgba(255,255,255,0.7)' }
                },
                scales: {
                    x: { ticks: { color: 'rgba(255,255,255,0.5)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: 'rgba(255,255,255,0.5)' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }

    private updateChart(): void {
        if (!this.chart) return;
        this.chart.data.datasets[0].label = `High (°${this.unit})`;
        this.chart.data.datasets[0].data = this.tempArr(this.historical.map(d => d.high));
        this.chart.data.datasets[1].label = `Low (°${this.unit})`;
        this.chart.data.datasets[1].data = this.tempArr(this.historical.map(d => d.low));
        this.chart.update();
    }
}
