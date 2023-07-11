import { Injectable } from '@angular/core';
import { Chart, ChartConfiguration, ChartData } from 'chart.js/auto';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  public initData: ChartData = {
    labels: [0], // x-axis labels
    datasets: [
      {
        label: 'Value',
        data: [0],
        backgroundColor: '#1D4ED8',
        minBarLength: 10,
        maxBarThickness: 40,
      },
    ],
  };

  public createChart(): Chart {
    return new Chart('myChart', this.getChartPayload(this.initData));
  }

  public addData(chart: Chart, interval: number, value: number): void {
    if (!chart) {
      return;
    }
    const lastLabel: number = chart.data.labels?.at(-1) as number;
    chart.data.labels?.push(lastLabel + interval);
    chart.data.datasets[0].data.push(value);
    chart.update();
  }

  private getChartPayload(data: ChartData): ChartConfiguration {
    return {
      type: 'bar',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            min: 0,
            max: 140,
          },
        },
      },
    };
  }
}
