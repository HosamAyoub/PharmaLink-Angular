import { ChangeDetectorRef, Component, effect, inject, OnInit, signal } from '@angular/core';
import { DashboardHeaderComponent } from '../Components/dashboard-header/dashboard-header.component';
import { IPharmacyAnalysis } from '../../../pharmacy-dashboard/Dashboard/Interface/pharmacy-analysis-interface';
import { AdminAnalysisServiceService } from '../Services/admin-analysis-service.service';
import { PharmacyService } from '../../../client-dashboard/Pharmacies/Service/pharmacy-service';
import { Ipharmacy } from '../../../client-dashboard/shared/models/ipharmacy';
import { LoadingSpinner } from "../../../../shared/components/loading-spinner/loading-spinner";
import { StatusCardComponent } from '../Components/status-card/status-card.component';
import { calculateMonthlyTrend } from '../../../../shared/utils/trend-calc.util';
import { MonthlyPerformanceComponent } from '../Components/monthly-performance/monthly-performance.component';
import { AdminAnalysisInterface } from '../Interface/admin-analysis-interface';
import { PharmaciesSummaryComponent } from '../Components/pharmacies-summary/pharmacies-summary.component';
import { RecentActivity } from '../../../admin-dashboard/Dashboard/Components/recent-activity/recent-activity';
import { SidebarStateServiceService } from '../../Shared/sidebar-state-service.service';
import { AdminNotificationsService } from '../../Shared/admin-notifications.service';
import { DrugRequestNotification } from '../../../pharmacy-dashboard/Dashboard/Interface/activity-notification';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [DashboardHeaderComponent, LoadingSpinner, StatusCardComponent,MonthlyPerformanceComponent,PharmaciesSummaryComponent,RecentActivity],
templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected analysisData: IPharmacyAnalysis | null = null;
  protected pharmacyData: Ipharmacy[] | null = null;
  protected pharmacySummary: AdminAnalysisInterface | null = null;
  protected errorMessage: string | null = null;
  protected loading: boolean = true;
  AdminNotifications : AdminNotificationsService = inject(AdminNotificationsService);
  Notifications = signal(this.AdminNotifications.Notifications());
   protected trends: {
    ordersTrend: string;
    revenueTrend: string;
    pharmacyTrend: string;
    DrugsTrend:string;
  } = {
    ordersTrend: '0%',
    revenueTrend: '0%',
    pharmacyTrend: '0%',
    DrugsTrend: '0%'
  };
  isSidebarOpen = true;
  constructor(private adminAnalysisService: AdminAnalysisServiceService, private pharmacyService: PharmacyService, private sidebarService: SidebarStateServiceService) 
  { 
    effect(() => {
      this.Notifications.set(this.AdminNotifications.Notifications());
    });
  }


  ngOnInit(): void {
    this.sidebarService.isOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
      this.cdr.detectChanges(); // Trigger change detection
    });
    this.AdminNotifications.GetAdminNotifications();
    this.Notifications.set(this.AdminNotifications.Notifications());
    console.log('At Dashboard Notifications:', this.Notifications());
    this.loadAnalysisData();
    this.loadPharmacyData();
    this.loadPharmacySummary();
  }

  private loadAnalysisData(): void {
    this.loading = true;
    this.errorMessage = null;
    this.adminAnalysisService.getAdminAnalysis().subscribe({
      next: (data) => {
        this.analysisData = data;
        this.calculateTrends();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Error loading analysis data';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  private loadPharmacyData(): void {
    this.loading = true;
    this.errorMessage = null;
    this.pharmacyService.getActivePharmacies().subscribe({
      next: (data) => {
        this.pharmacyData = data;
        this.calculateTrends();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Error loading pharmacy data';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  private loadPharmacySummary(): void {
    this.loading = true;
    this.errorMessage = null;
    this.adminAnalysisService.getPharmaciesSummary().subscribe({
      next: (data) => {
        this.pharmacySummary = data;
        console.log('Summary Loaded;', this.pharmacySummary);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Error loading pharmacy summary';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

   private calculateTrends(): void {
    if (this.analysisData && this.pharmacyData) {
      this.trends = calculateMonthlyTrend(
        this.analysisData.monthlyStats,
        this.pharmacyData
      );
    }
  }
  get cards() {
    return [
      {
        title: 'Total Medicines',
        value: this.pharmacySummary?.allDrugStock || 0,
        icon: 'pills',
        color: 'var(--blue-200)',
        trend: this.trends.DrugsTrend
      },
      {
        title: 'Total Pharmacies',
        value: this.pharmacyData?.length || 0,
        icon: 'pharmacy',
        color: 'var(--orange)',
        trend: this.trends.pharmacyTrend
      },
      {
        title: 'Total Orders',
        value: this.analysisData?.totalOrders || 0,
        icon: 'cart-shopping',
        color: 'var(--violet)',
        trend: this.trends.ordersTrend
      },
      {
        title: 'Total Revenue',
        value: '$' + (this.analysisData?.totalRevenue?.toLocaleString() || '0'),
        icon: 'dollar-sign',
        color: 'var(--light-green)',
        trend: this.trends.revenueTrend
      },
    ];
  }
}
