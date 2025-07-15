import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sharedPipes'
})
export class SharedPipesPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
