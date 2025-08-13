import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js'
import { MonthlyStat } from '../../Interface/pharmacy-analysis-interface';
import { FormsModule, NgModel } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { JsonPipe, NgFor } from '@angular/common';
import { parse } from 'date-fns';

@Component({
  selector: 'app-monthly-performance-section',
  imports: [FormsModule, BaseChartDirective],
  templateUrl: './monthly-performance-section.html',
  styleUrl: './monthly-performance-section.css'
})
export class MonthlyPerformanceSection implements OnInit {
  @Input() monthlyStats: MonthlyStat[] | undefined = [];

  // Chart configurations
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartConfiguration['options'] = {
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

  public barChartData: ChartData<'bar'> = {
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
    //console.log('Monthly stats:', this.monthlyStats);
  }

private extractAvailableYears(): void {
  if (!this.monthlyStats) {
    this.availableYears = [];
    return;
  }

  this.availableYears = [...new Set(
    this.monthlyStats.map(stat => {
      const yearPart = stat.monthYear.split(' ')[1];
      return Number(yearPart); // Ensure numeric
    })
  )].sort((a, b) => b - a);

  // console.log('Available years:', this.availableYears);

  if (this.availableYears.length > 0) {
    this.selectedYear = this.availableYears[0]; // Always reset to first available year
  } else {
    this.selectedYear = new Date().getFullYear();
  }
}

private processChartData(): void {
  if (!this.monthlyStats || this.monthlyStats.length === 0) {
    // console.warn('No data available');
    this.barChartData = {
      labels: this.allMonths.map(m => `${m} ${this.selectedYear}`),
      datasets: [
        { data: [0], label: 'Revenue ($)' },
        { data: [0], label: 'Orders' }
      ]
    };
    return;
  }

  // console.log('Raw data:', JSON.parse(JSON.stringify(this.monthlyStats)));


  const selectedYear = Number(this.selectedYear);


  const allMonths = this.allMonths;
  const revenueData = new Array(12).fill(0);
  const ordersData = new Array(12).fill(0);

  this.monthlyStats
    .filter(stat => {
      const yearPart = stat.monthYear.split(' ')[1];
      const year = Number(yearPart);
      
      // console.log(`Comparing:`, {
      //   input: stat.monthYear,
      //   extracted: year,
      //   selected: selectedYear,
      //   typeExtracted: typeof year,
      //   typeSelected: typeof selectedYear,
      //   equality: year === selectedYear
      // });
      
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

  // console.log('Filtered data:', {
  //   labels: allMonths,
  //   revenueData: revenueData,
  //   ordersData: ordersData
  // });

  this.barChartData = {
    labels: allMonths,
    datasets: [
      {
        label: 'Revenue ($)',
        data: revenueData,
        backgroundColor: 'rgb(59, 130, 246)',
        yAxisID: 'y'
      },
      {
        label: 'Orders',
        data: ordersData,
        backgroundColor: 'rgb(255, 130, 170)',
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
