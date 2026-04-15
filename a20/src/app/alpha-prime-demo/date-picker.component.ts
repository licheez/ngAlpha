import {Component} from '@angular/core';
import {AlphaPrimeDatePickerComponent}
  from '../../../projects/alpha-prime/src/lib/components/alpha-prime-date-picker/alpha-prime-date-picker.component';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-date-picker',
  template: `
    <section>
      <h2>Date Picker Component Demo</h2>
      <alpha-prime-date-picker
        [(date)]="selectedDate"
        [placeHolder]="['Select a date', 'Choose your date']"
        [minDate]="minDate"
        [maxDate]="maxDate"
        [sm]="false"
      ></alpha-prime-date-picker>
      <p>Selected Date: {{ selectedDate | date:'full' }}</p>
    </section>
    `,
  styles: [],
  imports: [
    AlphaPrimeDatePickerComponent,
    DatePipe
  ]
})
export class DatePickerComponent {
  selectedDate: Date | undefined;
  minDate: Date = new Date(2000, 0, 1);
  maxDate: Date = new Date(2100, 11, 31);
}
