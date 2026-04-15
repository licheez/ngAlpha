import {Component, EventEmitter, Input, OnDestroy, Output, signal} from '@angular/core';
import {AlphaPrimeService} from '../../services/alpha-prime.service';
import {InputGroup} from 'primeng/inputgroup';
import {DatePicker} from 'primeng/datepicker';
import {FormsModule} from '@angular/forms';
import {InputGroupAddon} from 'primeng/inputgroupaddon';
import {Button} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {NgClass} from '@angular/common';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'alpha-prime-date-picker',
  imports: [
    InputGroup,
    DatePicker,
    FormsModule,
    InputGroupAddon,
    Button,
    Ripple,
    NgClass,
    InputText
  ],
  templateUrl: './alpha-prime-date-picker.component.html',
  styleUrl: './alpha-prime-date-picker.component.css'
})
export class AlphaPrimeDatePickerComponent implements OnDestroy {
  @Input() name;

  phInterval: any;
  ph = signal<string>('dd/mm/yyyy');

  @Input()
  set placeHolder(ph: string | string[]) {
    const phLoop: string[] = [this.dateFormat];
    if (Array.isArray(ph)) {
      for (const p of ph) {
        phLoop.push(p);
      }
    } else {
      phLoop.push(ph);
    }

    let i  = 0;
    this.ph.set(phLoop[i]);
    this.phInterval = setInterval(() => {
      i++;
      if (i > ph.length) {
        i = 0;
      }
      this.ph.set(phLoop[i]);
    }, 3000);
  }

  @Input() disabled = false;
  @Input() showClear = true;
  @Input() showTime = false;
  @Input() showSeconds = false;
  @Input() dateFormat = 'dd/mm/yy';
  @Input() minDate: Date = new Date(1971, 0, 1);
  @Input() maxDate: Date = new Date(3000, 11, 31);
  @Input() date: Date | undefined;
  @Input() readonly = false;
  @Input() readonlyCaption: string | undefined | null = '';
  @Input() sm = false;
  @Output() dateChange = new EventEmitter<Date | undefined>();

  constructor(private mPs: AlphaPrimeService) {
    this.name = this.mPs.generateRandomName();
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
