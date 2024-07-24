import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {CalendarModule} from "primeng/calendar";
import {FormsModule} from "@angular/forms";
import {RippleModule} from "primeng/ripple";
import {InputTextModule} from "primeng/inputtext";
import {AlphaPrimeService} from "../../services/alpha-prime.service";

@Component({
  selector: 'alpha-prime-date-picker',
  standalone: true,
  imports: [
    NgIf,
    CalendarModule,
    FormsModule,
    RippleModule,
    NgClass,
    InputTextModule
  ],
  templateUrl: './alpha-prime-date-picker.component.html',
  styleUrl: './alpha-prime-date-picker.component.css'
})
export class AlphaPrimeDatePickerComponent implements OnDestroy {

  @Input() name = '';

  phInterval : any;
  ph = 'dd/mm/yyyy';
  @Input()
  set placeHolder (ph: string | string[]) {
    if (Array.isArray(ph)) {
      let i = 0;
      this.ph = ph[i];
      this.phInterval = setInterval(
        () => {
          i++;
          if (i >= ph.length) {
            i = 0;
          }
          this.ph = ph[i];
        }, 5000);
    } else {
      console.log('this is not an array');
      this.ph = ph;
    }
  }

  @Input() disabled = false;
  @Input() showClear = true;
  @Input() showTime = false;
  @Input() showSeconds = false;
  @Input() dateFormat = 'dd/mm/yy';
  @Input() minDate: Date = new Date(1971,0,1);
  @Input() maxDate: Date = new Date(3000,11,31);
  @Input() date: Date | undefined;
  @Input() readonly = false;
  @Input() readonlyCaption: string | undefined | null = '';
  @Input() sm = false;
  @Output() dateChange = new EventEmitter<Date | undefined>();

  constructor(ps: AlphaPrimeService) {
    this.name = ps.generateRandomName();
  }

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

  ngOnDestroy(): void {
    if (this.phInterval) {
      clearInterval(this.phInterval);
    }
  }

  onClear(): void {
    this.date = undefined;
    this.dateChange.emit(undefined);
  }

  onDateChanged(dt: Date): void {
    this.dateChange.emit(dt);
  }
}
