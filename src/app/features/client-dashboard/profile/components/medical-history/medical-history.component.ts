import { Component, Input, OnInit, signal } from '@angular/core';
import { LoadingSpinner } from '../../../../../shared/components/loading-spinner/loading-spinner';
import { Patient } from '../../../../../shared/models/user.model';

interface MedicalHistoryData {
  conditions: string[];
  medications: string[];
  allergies: string[];
}

@Component({
  selector: 'app-medical-history',
  standalone: true,
  imports: [LoadingSpinner],
  templateUrl: './medical-history.component.html',
  styleUrl: './medical-history.component.css',
})
export class MedicalHistoryComponent implements OnInit {
  @Input() profile: Patient | null = null;

  isLoading = signal(false);
  medicalData: MedicalHistoryData = {
    conditions: [],
    medications: [],
    allergies: [],
  };

  ngOnInit() {
    this.loadMedicalHistory();
  }

  loadMedicalHistory() {
    this.isLoading.set(true);

    // Simulate API call
    setTimeout(() => {
      // Parse patient diseases and drugs from parent data
      this.medicalData = {
        conditions: this.profile?.patientDiseases
          ? this.profile.patientDiseases.split(',').map((d: string) => d.trim())
          : ['Hypertension', 'Diabetes Type 2'],
        medications: this.profile?.patientDrugs
          ? this.profile.patientDrugs.split(',').map((d: string) => d.trim())
          : ['Metformin 500mg', 'Lisinopril 10mg'],
        allergies: ['Penicillin', 'Sulfa drugs'], // Mock data for now
      };
      this.isLoading.set(false);
    }, 800);
  }
}
