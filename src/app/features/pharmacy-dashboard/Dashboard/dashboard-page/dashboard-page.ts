import { QuickActions } from './../Components/quick-actions/quick-actions';
import { StatsCard } from './../Components/stats-card/stats-card';
import { DashboardHeader } from './../Components/dashboard-header/dashboard-header';
import { Component, ChangeDetectorRef, OnInit, inject, signal } from '@angular/core';
import { PharmacyAnalysisService } from '../Services/pharmacy-analysis-service';
import { IPharmacyAnalysis, IPharmacystockAnalysis } from '../Interface/pharmacy-analysis-interface';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { TopSellingProductsSection } from '../Components/top-selling-products-section/top-selling-products-section';
import { MonthlyPerformanceSection } from '../Components/monthly-performance-section/monthly-performance-section';
import { RecentActivity } from '../Components/recent-activity/recent-activity';
import { TopCustomersSection } from '../Components/top-customers-section/top-customers-section';
import { calculateMonthlyTrend } from '../../../../shared/utils/trend-calc.util';
import { OrdersSignalrServiceService } from '../../Shared/Services/orders-signalr-service.service';
import { ActivityNotification } from '../Interface/activity-notification';

@Component({
  selector: 'app-dashboard-page',
  imports: [DashboardHeader, StatsCard, QuickActions, LoadingSpinner, TopSellingProductsSection, MonthlyPerformanceSection, RecentActivity],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css'
})
export class DashboardPage implements OnInit {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected analysisData: IPharmacyAnalysis | null = null;
  protected stockAnalysisData: IPharmacystockAnalysis | null = null;
  protected errorMessage: string | null = null;
  protected loading: boolean = true;
  protected trends: {
    ordersTrend: string;
    revenueTrend: string;
    pharmacyTrend: string;
    DrugsTrend: string;
  } = {
      ordersTrend: '6%',
      revenueTrend: '-8%',
      pharmacyTrend: '4%',
      DrugsTrend: '25%'
    };
  constructor(private pharmacyAnalysisService: PharmacyAnalysisService) { }

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
        this.calculateTrends();
        this.loading = false;
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
      next: (data: any) => {
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

    return [
      {
        title: 'Available Medicines',
        value: this.stockAnalysisData?.inStockCount || 0,
        description: 'In stock and ready',
        icon: 'pills',
        color: 'var(--light-green)',
        trend: this.trends.DrugsTrend
      },
      {
        title: 'Out of Stock',
        value: this.stockAnalysisData?.outOfStockCount || 0,
        description: 'Needs restocking',
        icon: 'triangle-exclamation',
        color: 'var(--error-red)',
        trend: '-50%'
      },
      {
        title: 'Total Revenue',
        value: '$' + (this.analysisData?.totalRevenue?.toLocaleString() || '0'),
        description: 'This month',
        icon: 'dollar-sign',
        color: 'var(--blue-200)',
        trend: this.trends.revenueTrend
      },
      {
        title: 'Total Customers',
        value: this.analysisData?.totalUniqueCustomers || 0,
        description: 'Registered users',
        icon: 'users',
        color: 'var(--violet)',
        trend: this.trends.pharmacyTrend
      },
      {
        title: 'Total Orders',
        value: this.analysisData?.totalOrders || 0,
        description: 'This month',
        icon: 'cart-shopping',
        color: 'var(--orange)',
        trend: this.trends.ordersTrend
      }
    ];
  }
  private calculateTrends(): void {
    if (this.analysisData) {
      this.trends = calculateMonthlyTrend(
        this.analysisData.monthlyStats,
        null
      );
    }
  }
}
