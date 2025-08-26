import { ChangeDetectorRef, Component } from '@angular/core';
import { IUsersDisplay } from '../Interface/users-display';
import { UserDisplayServiceService } from '../Services/user-display-service.service';
import { PageHeaderComponent } from '../Components/page-header/page-header.component';
import { UserManagementComponent } from '../Components/user-management/user-management.component';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [PageHeaderComponent,UserManagementComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css'
})
export class UsersPageComponent {

 
  

}
