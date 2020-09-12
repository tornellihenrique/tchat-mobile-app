import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'hoursMinutes',
})
export class HoursMinutesPipe implements PipeTransform {
  constructor() {}

  transform(value: Date, args?: any): any {
    if (!value || (value && !(value instanceof Date))) {
      return '';
    }

    const date = moment(value);

    return date.format('HH:mm');
  }
}
