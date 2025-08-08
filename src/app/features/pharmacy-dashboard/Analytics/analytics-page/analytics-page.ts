import { TopCustomersSection } from './../../Dashboard/Components/top-customers-section/top-customers-section';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IPharmacyAnalysis } from '../../Dashboard/Interface/pharmacy-analysis-interface';
import { PharmacyAnalysisService } from '../../Dashboard/Services/pharmacy-analysis-service';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { TopSellingProductsSection } from '../../Dashboard/Components/top-selling-products-section/top-selling-products-section';
import { MonthlyPerformanceSection } from '../../Dashboard/Components/monthly-performance-section/monthly-performance-section';

@Component({
  selector: 'app-analytics-page',
  imports: [RouterLink, LoadingSpinner,TopCustomersSection,TopSellingProductsSection,MonthlyPerformanceSection],
  templateUrl: './analytics-page.html',
  styleUrl: './analytics-page.css'
})
export class AnalyticsPage implements OnInit {
  protected analysisData: IPharmacyAnalysis | null = null;
  protected errorMessage: string | null = null;
  protected loading: boolean = true;
  constructor(private pharmacyAnalysisService: PharmacyAnalysisService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadAnalysisData();
  }

  private loadAnalysisData(): void {
    this.loading = true;
    this.errorMessage = null;
    this.pharmacyAnalysisService.getPharmacyAnalysis().subscribe({
      next: (data) => {
        this.analysisData = data;
        this.loading = false;
        this.cdr.detectChanges();
        // console.log('Pharmacy analysis data loaded:', this.analysisData);
      },
      error: (error) => {
        this.errorMessage = 'Error loading analysis data';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  
  get cards() {
  if (!this.analysisData) return [];

  return [
    
    {
      title: 'Total Revenue',
      value: '$' + (this.analysisData.totalRevenue?.toLocaleString() || '0'),
      trend: '+4.2%'
    },
    {
      title: 'Avg Order Value',
      value: '$' + (this.analysisData.totalRevenue/this.analysisData.totalOrders) || 0,
      trend: '+15%'
    },
    {
      title: 'Total Orders',
      value: this.analysisData.totalOrders.toLocaleString() || '0',
      trend: '+12.5%'
    },  
    {
      title: 'Total Customers',
      value: this.analysisData.totalUniqueCustomers || 0,
      trend: '-10%'
    }
  ];
}

  exportOrdersAsCSV() {
    const analysis = this.analysisData;
    const csvRows = [];

    // Header row
    const headers = ['monthYear', 'orderCount', 'totalRevenue'];
    csvRows.push(headers.join(','));
    
    // Data rows
    analysis?.monthlyStats.forEach(stat => {
      csvRows.push([
        stat.monthYear,
        stat.orderCount,
        stat.totalRevenue,
      ].join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Monthly Performance.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
