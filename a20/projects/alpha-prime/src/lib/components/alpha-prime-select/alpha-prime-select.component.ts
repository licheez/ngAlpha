import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

import { AlphaPrimeService } from '../../services/alpha-prime.service';
import { AlphaPrimeSelectInfo, IAlphaPrimeSelectOption } from './alpha-prime-select-info';

@Component({
  selector: 'alpha-prime-select',
  standalone: true,
  imports: [
    SelectModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    InputTextModule
  ],
  templateUrl: './alpha-prime-select.component.html',
  styleUrl: './alpha-prime-select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlphaPrimeSelectComponent {
  private readonly mPs = inject(AlphaPrimeService);

  name = input(this.mPs.generateRandomName());
  asi = input<AlphaPrimeSelectInfo | undefined>(undefined);
  options = input<IAlphaPrimeSelectOption[]>([]);
  placeHolder = input('');
  disabled = input(false);
  readonly = input(false);
  readonlyCaption = input<string | null | undefined>('');
  showAdd = input(false);
  showClear = input(true);

  optionId = model<string | undefined>(undefined);

  optionChange = output<IAlphaPrimeSelectOption | undefined>();
  addClicked = output<void>();

  effectiveOptions = computed(() => this.asi()?.options ?? this.options());
  showActionButtons = computed(() => this.showAdd() || (!!this.optionId() && this.showClear()));

  constructor() {
    effect(() => {
      const info = this.asi();
      if (info) {
        this.setOptionId(info.optionId);
      }
    });
  }

  private setOptionId(id: string | undefined): void {
    this.optionId.set(id);
    const key = this.asi()?.lsItemKey;
    if (key && id) {
      localStorage.setItem(key, id);
    }
  }

  onOptionChange(id: string | undefined): void {
    this.setOptionId(id);
    const option =
      this.effectiveOptions().find(o => o.id === id);
    this.optionChange.emit(option);
  }

  onClear(): void {
    this.optionId.set(undefined);
    this.optionChange.emit(undefined);
  }

  onAdd(): void {
    this.addClicked.emit();
  }
}
