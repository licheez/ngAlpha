
import { Component } from '@angular/core';
import {AlphaPrimeDateRangePickerComponent}
  from '../../../projects/alpha-prime/src/lib/components/alpha-prime-date-range-picker/alpha-prime-date-range-picker.component';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-date-range-picker',
  template: `
    <section>
      <h2>Date Range Picker Component Demo</h2>
      <alpha-prime-date-range-picker
        [(startDate)]="startDate"
        [(endDate)]="endDate"
        [minDate]="minDate"
        [maxDate]="maxDate"
        [sm]="false"
      ></alpha-prime-date-range-picker>
      <p>Start Range: {{startDate | date: 'full'}} </p>
      <p>End Range: {{endDate | date: 'full'}} </p>
    </section>
  `,
  styles: [],
  imports: [
    AlphaPrimeDateRangePickerComponent,
    DatePipe
  ]
})
export class DateRangePickerComponent {
  startDate: Date | undefined;
  endDate: Date | undefined;
  minDate: Date = new Date(2000, 0, 1);
  maxDate: Date = new Date(2100, 11, 31);
}
