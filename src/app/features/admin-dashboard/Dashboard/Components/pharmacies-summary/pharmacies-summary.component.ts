import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AdminAnalysisInterface } from '../../Interface/admin-analysis-interface';

@Component({
  selector: 'app-pharmacies-summary',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './pharmacies-summary.component.html',
  styleUrl: './pharmacies-summary.component.css'
})
export class PharmaciesSummaryComponent implements OnInit {
  @Input() analysisData: AdminAnalysisInterface | null = null;

  public pieChartType: ChartType = 'pie';
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            const percentages = (context.dataset as any).percentages;
            const percentage = percentages?.[context.dataIndex] || '0';
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  public pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384', '#3498db', '#FFCE56', '#9333ea', '#ea580c', '#16A34A'
      ]
    }]
  };

  ngOnInit(): void {
    this.updateChartData();
  }

  ngOnChanges(): void {
    this.updateChartData();
  }

  private updateChartData(): void {
    if (!this.analysisData || !this.analysisData.pharmacySummary) {
      return;
    }

    const pharmaciesWithRevenue = this.analysisData.pharmacySummary
      .filter(pharmacy => pharmacy.totalRevenue > 0)
      .sort((a, b) => b.totalRevenue - a.totalRevenue);

    const topPharmacies = pharmaciesWithRevenue.slice(0, 5);
    const othersRevenue = pharmaciesWithRevenue.slice(5).reduce((sum, pharmacy) => sum + pharmacy.totalRevenue, 0);

    const labels = topPharmacies.map(pharmacy => pharmacy.name);
    const data = topPharmacies.map(pharmacy => pharmacy.totalRevenue);

    if (othersRevenue > 0) {
      labels.push('Others');
      data.push(othersRevenue);
    }

    const percentages = data.map(value =>
      ((value / this.analysisData!.allrevenue) * 100).toFixed(1)
    );

    this.pieChartData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: this.pieChartData.datasets[0].backgroundColor,
        percentages: percentages
      }]
    };
  }
}