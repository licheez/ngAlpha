import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IAlphaPrimeSwitchOption} from "./alpha-prime-switch-option";
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {InputSwitchModule} from "primeng/inputswitch";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'alpha-prime-switch',
  standalone: true,
  imports: [
    InputSwitchModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './alpha-prime-switch.component.html',
  styleUrl: './alpha-prime-switch.component.css'
})
export class AlphaPrimeSwitchComponent {
  @Input() name = '';
  @Input() disabled = false;
  private _switchOption: IAlphaPrimeSwitchOption = { caption: '', id: '', selected: true };
  @Input()
  set switchOption(switchOption: IAlphaPrimeSwitchOption) {
    this._switchOption = switchOption;
    if (switchOption.lsItemKey) {
      const lsItem = localStorage.getItem(switchOption.lsItemKey);
      if (lsItem) {
        this._switchOption.selected = lsItem === 'true';
      }
    }
  }
  get switchOption(): IAlphaPrimeSwitchOption {
    return this._switchOption;
  }

  @Output() switchOptionChange = new EventEmitter<IAlphaPrimeSwitchOption>();

  constructor(
    ps: AlphaPrimeService) {
    this.name = ps.generateRandomName();
  }

  private check(selected: boolean): void {
    this.switchOption.selected = selected;
    this.switchOptionChange.emit(this.switchOption);
    if (this.switchOption.lsItemKey) {
      localStorage.setItem(
        this.switchOption.lsItemKey,
        selected ? 'true' : 'false');
    }
  }

  onChange(e: { checked: boolean; }) {
    this.check(e.checked);
  }

  onCaptionClicked(): void {
    this.check(!this.switchOption.selected);
  }

}
