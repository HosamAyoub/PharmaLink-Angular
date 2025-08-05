import { Component, Input } from '@angular/core';
import { getIconClass } from '../../../../../shared/utils/icon-mapper.util';
@Component({
  selector: 'app-stats-card',
  imports: [],
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.css'
})
export class StatsCard {
  @Input() title!: string;
  @Input() value!: string | number;
  @Input() description!: string;
  @Input() trend?: string;
  @Input() color!: string;
  @Input() icon!: string;

  getIconClass = getIconClass;
}
