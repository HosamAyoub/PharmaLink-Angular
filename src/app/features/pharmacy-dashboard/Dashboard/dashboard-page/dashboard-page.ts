import { QuickActions } from './../Components/quick-actions/quick-actions';
import { StatsCard } from './../Components/stats-card/stats-card';
import { DashboardHeader } from './../Components/dashboard-header/dashboard-header';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { PharmacyAnalysisService } from '../Services/pharmacy-analysis-service';
import { IPharmacyAnalysis, IPharmacystockAnalysis } from '../Interface/pharmacy-analysis-interface';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { TopSellingProductsSection } from '../Components/top-selling-products-section/top-selling-products-section';

@Component({
  selector: 'app-dashboard-page',
  imports: [DashboardHeader,StatsCard,QuickActions,LoadingSpinner,TopSellingProductsSection],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css'
})
export class DashboardPage implements OnInit {
  protected analysisData: IPharmacyAnalysis | null = null;
  protected stockAnalysisData: IPharmacystockAnalysis | null = null;
  protected errorMessage: string | null = null;
  protected loading: boolean = true;
  constructor(private pharmacyAnalysisService: PharmacyAnalysisService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadAnalysisData();
    this.loadPharmacyStockAnalysis();
  }

  private loadAnalysisData(): void {
    this.loading = true;
    this.errorMessage = null;
    this.pharmacyAnalysisService.getPharmacyAnalysis().subscribe({
      next: (data) => {
        this.analysisData = data;
        //this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Error loading analysis data';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  private loadPharmacyStockAnalysis(): void {
    this.loading = true;
    this.errorMessage = null;
    this.pharmacyAnalysisService.getPharmacyStockAnalysis().subscribe({
      next: (data:any) => {
        this.stockAnalysisData = data.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Error loading stock analysis data';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  
  get cards() {
  if (!this.analysisData || !this.stockAnalysisData) return [];

  return [
    {
      title: 'Available Medicines',
      value: this.stockAnalysisData.inStockCount || 0,
      description: 'In stock and ready',
      icon: 'pills',
      color: 'var(--light-green)',
      trend: '-8%'
    },
    {
      title: 'Out of Stock',
      value: this.stockAnalysisData.outOfStockCount || 0,
      description: 'Needs restocking',
      icon: 'triangle-exclamation',
      color: 'var(--error-red)',
      trend: '+0%'
    },
    {
      title: 'Total Revenue',
      value: '$' + (this.analysisData.totalRevenue?.toLocaleString() || '0'),
      description: 'This month',
      icon: 'dollar-sign',
      color: 'var(--blue-200)',
      trend: '+12.5%'
    },
    {
      title: 'Total Customers',
      value: this.analysisData.totalUniqueCustomers || 0,
      description: 'Registered users',
      icon: 'users',
      color: 'var(--violet)',
      trend: '+15%'
    },
    {
      title: 'Total Orders',
      value: this.analysisData.totalOrders || 0,
      description: 'This month',
      icon: 'cart-shopping',
      color: 'var(--orange)',
      trend: '-10%'
    }
  ];
}
}
