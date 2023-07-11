import { AfterViewInit, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { catchError, retry, throwError } from 'rxjs';
import { ChartService } from './services/chart.service';
import { WebSocketService } from './services/web-socket.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
  public interval: number = 1;
  public chart!: Chart;

  constructor(
    private ws: WebSocketService,
    private chartService: ChartService
  ) {
    this.ws.webSocket$
      .pipe(
        catchError((error) => {
          this.interval = 1;
          return throwError(() => new Error(error));
        }),
        retry({ delay: 5_000 }),
        takeUntilDestroyed()
      )
      .subscribe((value: string) => {
        this.chartService.addData(this.chart, this.interval, parseInt(value));
      });
  }

  ngAfterViewInit(): void {
    this.chart = this.chartService.createChart();
  }

  updateInterval(interval: number) {
    this.interval = interval;
    this.ws.updateInterval(interval);
  }
}
