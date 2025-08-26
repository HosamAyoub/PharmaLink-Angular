import { LoadingSpinner } from './../../../../../shared/components/loading-spinner/loading-spinner';
import { ChangeDetectorRef, Component } from '@angular/core';
import { UserDisplayServiceService } from '../../Services/user-display-service.service';
import { IUsersDisplay } from '../../Interface/users-display';
import { switchMap } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [DatePipe,CommonModule,FormsModule,LoadingSpinner],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {

  protected users: IUsersDisplay[] = [];
  protected errorMessage: string | null = null;
  protected loading: boolean = true;
  showDetailsModal: boolean = false;
  selectedUser: IUsersDisplay | null = null;

  constructor(private userService: UserDisplayServiceService, private cdr: ChangeDetectorRef) {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading = true;
    this.userService.getAllPatients().subscribe({
      next: (data) => {
        this.users = data;
        console.log('Users loaded:', this.users);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Error loading users';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  public suspendUser(user: IUsersDisplay): void {
    if (!user) return;
    this.loading = true;
    this.userService.suspendPatient(user.patientId).pipe(
      switchMap((suspendResponse) => {
        console.log('Suspend response:', suspendResponse);
        //console.log('Suspended user ID:', user.userId);
        return this.userService.changeUserRole(user.userId, 'Suspended');
      })
    ).subscribe({
      next: (roleChangeResponse) => {
        user.status = 0;
        console.log('Role change response:', roleChangeResponse);
        this.loadUsers();
        this.cdr.detectChanges();
        this.closeModal();
        this.loading = false
      },
      error: (error) => {
        this.errorMessage = 'Error suspending user';
        this.loading = false;
        console.error(error);
        this.cdr.detectChanges();
      }
    });
  }
  public activateUser(user: IUsersDisplay): void {
    if (!user) return;
    this.loading = true;
    this.userService.activatePatient(user.patientId).pipe(
      switchMap(() => this.userService.changeUserRole(user.userId, 'Patient'))
    ).subscribe({
      next: () => {
        user.status = 1;
        this.loadUsers();
        this.cdr.detectChanges();
        this.loading = false
      },
      error: (error) => {
        this.errorMessage = 'Error suspending user';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  getStatusClass(status: number | undefined): string {
    switch (status) {
      case 1: return 'status-active';
      case 0: return 'status-suspended';
      default: return 'status-active';
    }
  }
  getStatusText(status: number | undefined): string {
    switch (status) {
      case 1: return 'Active';
      case 0: return 'Suspended';
      default: return 'Active';
    }
  }
  viewDetails(user: IUsersDisplay) {
      this.selectedUser = user;
      this.showDetailsModal = true;
    }
  
    closeModal() {
      this.showDetailsModal = false;
      this.selectedUser = null;
    }
    formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
