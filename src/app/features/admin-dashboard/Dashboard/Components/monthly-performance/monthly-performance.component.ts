import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js'
import { FormsModule, NgModel } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { JsonPipe, NgFor } from '@angular/common';
import { parse } from 'date-fns';
import { MonthlyStat } from '../../../../pharmacy-dashboard/Dashboard/Interface/pharmacy-analysis-interface';

@Component({
  selector: 'app-monthly-performance',
  standalone: true,
  imports: [FormsModule, BaseChartDirective],
  templateUrl: './monthly-performance.component.html',
  styleUrl: './monthly-performance.component.css'
})
export class MonthlyPerformanceComponent implements OnInit {
  @Input() monthlyStats: MonthlyStat[] | undefined = [];

  public lineChartType: ChartType = 'line';
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: false },
      y: { 
        stacked: false,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue ($)'
        }
      },
      y1: {
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Orders'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Monthly Revenue and Orders'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.dataset.yAxisID === 'y1') {
              label += context.raw;
            } else {
              label += '$' + context.raw?.toLocaleString();
            }
            return label;
          }
        }
      }
    }
  };

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  availableYears: number[] = [];
  selectedYear: number = new Date().getFullYear();
  allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  ngOnInit(): void {
    this.processChartData();
    this.extractAvailableYears();  
  }

  ngOnChanges(): void {
    this.processChartData();
    this.extractAvailableYears();
  }

  private extractAvailableYears(): void {
    if (!this.monthlyStats) {
      this.availableYears = [];
      return;
    }

    this.availableYears = [...new Set(
      this.monthlyStats.map(stat => {
        const yearPart = stat.monthYear.split(' ')[1];
        return Number(yearPart);
      })
    )].sort((a, b) => b - a);

    if (this.availableYears.length > 0) {
      this.selectedYear = this.availableYears[0];
    } else {
      this.selectedYear = new Date().getFullYear();
    }
  }

  private processChartData(): void {
    if (!this.monthlyStats || this.monthlyStats.length === 0) {
      this.lineChartData = {
        labels: this.allMonths.map(m => `${m} ${this.selectedYear}`),
        datasets: [
          { data: [0], label: 'Revenue ($)' },
          { data: [0], label: 'Orders' }
        ]
      };
      return;
    }

    const selectedYear = Number(this.selectedYear);
    const allMonths = this.allMonths;
    const revenueData = new Array(12).fill(0);
    const ordersData = new Array(12).fill(0);

    this.monthlyStats
      .filter(stat => {
        const yearPart = stat.monthYear.split(' ')[1];
        const year = Number(yearPart);
        return year === selectedYear;
      })
      .forEach(stat => {
        const month = stat.monthYear.split(' ')[0];
        const monthIndex = this.allMonths.indexOf(month);
        if (monthIndex >= 0) {
          revenueData[monthIndex] = stat.totalRevenue;
          ordersData[monthIndex] = stat.orderCount;
        }
      });

    this.lineChartData = {
      labels: allMonths,
      datasets: [
        {
          label: 'Revenue ($)',
          data: revenueData,
          borderColor: 'rgb(59, 130, 246)', // Changed from backgroundColor
          backgroundColor: 'rgba(59, 130, 246, 0.1)', // Added for fill
          fill: true,
          tension: 0.3, // Makes the line slightly curved
          yAxisID: 'y'
        },
        {
          label: 'Orders',
          data: ordersData,
          borderColor: 'rgb(255, 130, 170)', // Changed from backgroundColor
          backgroundColor: 'rgba(255, 130, 170, 0.1)', // Added for fill
          fill: true,
          tension: 0.3, // Makes the line slightly curved
          yAxisID: 'y1'
        }
      ]
    };
  }

  onYearChange(year: number): void {
    this.selectedYear = year;
    this.processChartData();
  }
}