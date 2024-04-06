import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefonePipe',
  standalone: true
})
export class TelefonePipePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value) {
      return '';
    }

    let formatted = value.replace(/\D/g, '');

    if (formatted.length == 11) {
      return formatted.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    return formatted.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

}
