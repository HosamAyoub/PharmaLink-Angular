import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Patient } from '../../../../../shared/models/user.model';
import { DateService } from '../../../../../shared/services/date.service';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css',
})
export class PersonalInfoComponent {
  @Input() profile: Patient | null = null;
  @Input() editMode: boolean = false;
  @Output() profileChange = new EventEmitter<Patient>();
  @Output() toggleEdit = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();

  private dateService = inject(DateService);

  // Alternative method using DateService instead of DatePipe
  formatDate(date: string | Date | null | undefined): string {
    return this.dateService.formatMediumDate(date);
  }

  getAge(): string {
    if (!this.profile?.dateOfBirth) return '';
    const age = this.dateService.calculateAge(this.profile.dateOfBirth);
    return age !== null ? ` (${age} years old)` : '';
  }

  onProfileChange() {
    if (this.profile) {
      this.profileChange.emit(this.profile);
    }
  }

  onToggleEdit() {
    this.toggleEdit.emit();
  }

  onCancelEdit() {
    this.cancelEdit.emit();
  }
}
