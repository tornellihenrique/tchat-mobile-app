import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LastMessageDatePipe } from './pipes/last-message-date.pipe';
import { HoursMinutesPipe } from './pipes/hours-minutes.pipe';

@NgModule({
  declarations: [LastMessageDatePipe, HoursMinutesPipe],
  imports: [CommonModule],
  exports: [LastMessageDatePipe, HoursMinutesPipe],
})
export class SharedModule {}
