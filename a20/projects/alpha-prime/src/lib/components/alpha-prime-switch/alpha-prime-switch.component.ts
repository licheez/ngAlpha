import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitch } from 'primeng/toggleswitch';

import { AlphaPrimeService } from '../../services/alpha-prime.service';
import { IAlphaPrimeSwitchOption } from './alpha-prime-switch-option';

@Component({
  selector: 'alpha-prime-switch',
  imports: [
    ToggleSwitch,
    FormsModule
  ],
  templateUrl: './alpha-prime-switch.component.html',
  styleUrl: './alpha-prime-switch.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlphaPrimeSwitchComponent {
  private readonly mPs = inject(AlphaPrimeService);

  name = input(this.mPs.generateRandomName());
  disabled = input(false);
  switchOption = input<IAlphaPrimeSwitchOption>({
    caption: '',
    id: '',
    selected: true
  });

  switchOptionChange = output<IAlphaPrimeSwitchOption>();

  private readonly resolvedSwitchOption = signal<IAlphaPrimeSwitchOption>({
    caption: '',
    id: '',
    selected: true
  });

  effectiveSwitchOption = computed(() => this.resolvedSwitchOption());

  constructor() {
    effect(() => {
      const incoming = this.switchOption();
      const lsItem = incoming.lsItemKey
        ? localStorage.getItem(incoming.lsItemKey)
        : null;

      this.resolvedSwitchOption.set({
        ...incoming,
        selected: lsItem ? lsItem === 'true' : incoming.selected
      });
    });
  }

  private check(selected: boolean): void {
    const nextOption = {
      ...this.effectiveSwitchOption(),
      selected
    };

    this.resolvedSwitchOption.set(nextOption);
    this.switchOptionChange.emit(nextOption);

    if (nextOption.lsItemKey) {
      localStorage.setItem(nextOption.lsItemKey, selected ? 'true' : 'false');
    }
  }

  onChange(event: { checked: boolean }): void {
    this.check(event.checked);
  }

  onCaptionClicked(): void {
    if (this.disabled()) {
      return;
    }
    this.check(!this.effectiveSwitchOption().selected);
  }
}
