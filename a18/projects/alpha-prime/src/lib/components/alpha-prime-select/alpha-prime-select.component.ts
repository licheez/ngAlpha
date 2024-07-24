import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {AlphaPrimeSelectInfo, IAlphaPrimeSelectOption} from "./alpha-prime-select-info";
import {NgIf} from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'alpha-prime-select',
  standalone: true,
  imports: [
    NgIf,
    DropdownModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    InputTextModule
  ],
  templateUrl: './alpha-prime-select.component.html',
  styleUrl: './alpha-prime-select.component.css'
})
export class AlphaPrimeSelectComponent {
  @Input() name = '';

  private _asi: AlphaPrimeSelectInfo | undefined;
  @Input()
  set asi(asi: AlphaPrimeSelectInfo | undefined) {
    this._asi = asi;
    if (asi === undefined) {
      this.options = [];
      this._optionId = undefined;
      return;
    }
    this.options = asi.options;
    this._optionId = asi.optionId;
  }
  get asi(): AlphaPrimeSelectInfo | undefined {
    return this._asi;
  }

  @Input() options: IAlphaPrimeSelectOption[] = []

  @Input() placeHolder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() readonlyCaption: string | undefined | null = '';
  /** whether of not to show the add button (default=false) */
  @Input() showAdd = false;
  /** whether of not to show the clear button (default=true) */
  @Input() showClear = true;

  private _optionId: string | undefined = undefined;
  @Input()
  set optionId(optionId: string | undefined) {
    this._optionId = optionId;
    if (optionId && this.asi?.lsItemKey) {
      localStorage.setItem(this.asi!.lsItemKey, optionId);
    }
  }
  get optionId(): string | undefined {
    return this._optionId;
  }

  @Output() optionIdChange = new EventEmitter<string | undefined>();
  @Output() optionChange = new EventEmitter<IAlphaPrimeSelectOption | undefined>();
  @Output() addClicked = new EventEmitter();

  constructor(ps: AlphaPrimeService) {
    this.name = ps.generateRandomName();
  }

  onOptionChange(id: string): void {
    this.optionId = id;
    this.optionIdChange.emit(id)
    const option =
      this.options.find(o => o.id === id);
    this.optionChange.emit(option);
  }

  onClear(): void {
    this.optionId = undefined;
    this.optionIdChange.emit(undefined)
    this.optionChange.emit(undefined)
  }

  onAdd(): void {
    this.addClicked.emit();
  }

}
