import { Component, Input } from '@angular/core';
import { getIconClass } from '../../../../../shared/utils/icon-mapper.util';

@Component({
  selector: 'app-status-card',
  standalone: true,
  imports: [],
  templateUrl: './status-card.component.html',
  styleUrl: './status-card.component.css'
})
export class StatusCardComponent {
  @Input() title!: string;
  @Input() value!: string | number;
  @Input() trend?: string;
  @Input() color1!: string;
  @Input() color2?: string = 'var(--black)';
  @Input() color3?: string = 'white';
  @Input() icon!: string;
  @Input() showTrend: boolean = true;

  getIconClass = getIconClass;
}
