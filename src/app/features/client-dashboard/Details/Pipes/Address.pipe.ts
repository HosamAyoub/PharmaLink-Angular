import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'AddressPipe',
  standalone: true
})
export class AddressPipe implements PipeTransform {
  // Transform the input string to return the first ten words
  transform(value: string): string {
    if (!value) return '';
    return value.trim().split(' ').slice(0, 8).join(' ');
  }
}
