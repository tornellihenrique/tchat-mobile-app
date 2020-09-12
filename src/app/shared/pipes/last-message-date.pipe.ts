import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'lastMessageDate',
})
export class LastMessageDatePipe implements PipeTransform {
  constructor() {}

  transform(value: Date, args?: any): any {
    if (!value || (value && !(value instanceof Date))) {
      return '';
    }

    const now = moment();
    const date = moment(value);

    if (now.isSame(date, 'day')) {
      return date.format('HH:mm');
    }

    if (now.isSame(date, 'week')) {
      return date.format('ddd');
    }

    if (now.isSame(date, 'year')) {
      return date.format('MMM') + date.day();
    }

    return date.format('L');
  }
}
