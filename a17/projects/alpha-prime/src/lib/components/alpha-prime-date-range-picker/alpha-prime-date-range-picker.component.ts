import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {CalendarModule} from "primeng/calendar";
import {FormsModule} from "@angular/forms";
import {RippleModule} from "primeng/ripple";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'lib-alpha-prime-date-range-picker',
  standalone: true,
  imports: [
    NgIf,
    CalendarModule,
    FormsModule,
    RippleModule,
    NgClass,
    InputTextModule
  ],
  templateUrl: './alpha-prime-date-range-picker.component.html',
  styleUrl: './alpha-prime-date-range-picker.component.css'
})
export class AlphaPrimeDateRangePickerComponent {
  dateRange: Date[] | undefined;

  @Input() startDate: Date | undefined;
  @Output() startDateChange = new EventEmitter<Date | undefined>();

  @Input() endDate: Date | undefined;
  @Output() endDateChange = new EventEmitter<Date | undefined>();

  @Input() disabled = false;

  @Input() minDate: Date = new Date(1971, 0, 1);
  @Input() maxDate: Date = new Date(3000, 11, 31);
  @Input() displayMonths = 1;
  @Input() dateFormat = 'dd M yy';
  @Input() placeHolder = '';
  @Input() readonly = false;
  @Input() readonlyCaption = '';
  @Input() sm = false;

  baseInputStyle = {
    'width': '100%',
    'border-top-right-radius': '0',
    'border-bottom-right-radius': '0'
  };

  smInputStyle = {
    'width': '100%',
    'border-top-right-radius': '0',
    'border-bottom-right-radius': '0',
    'font-size': 'x-small'
  };

  get inputStyle(): any {
    return this.sm
      ? this.smInputStyle
      : this.baseInputStyle;
  }

  onSelection(dateRange: Date[]) {
    this.startDate = dateRange[0];
    this.endDate = dateRange[1] == null
      ? undefined
      : dateRange[1];
    this.startDateChange.emit(this.startDate);
    this.endDateChange.emit(this.endDate);
  }

  onClear(): void {
    this.dateRange = undefined;
    this.startDate = undefined;
    this.endDate = undefined;
    this.startDateChange.emit(this.startDate);
    this.endDateChange.emit(this.startDate);
  }

}
