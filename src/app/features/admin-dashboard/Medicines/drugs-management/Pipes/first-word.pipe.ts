import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstWord',
  standalone: true
})
export class FirstWordPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.trim().split(' ')[0] + (value.trim().split(' ')[1] ? ' ' + value.trim().split(' ')[1] : '');
  }
}
