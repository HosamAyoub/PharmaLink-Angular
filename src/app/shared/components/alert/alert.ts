import { NgClass } from '@angular/common';
import { Component, effect, input } from '@angular/core';
import { FormState } from '../../enums/FormState';

@Component({
  selector: 'app-alert',
  imports: [NgClass],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {
  public alertState = input.required<FormState>();
  public alertMessage = input.required<string>();
  public FormState = FormState;
}
