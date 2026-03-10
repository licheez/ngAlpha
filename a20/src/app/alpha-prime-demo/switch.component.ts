import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {
  AlphaPrimeSwitchComponent
} from '../../../projects/alpha-prime/src/lib/components/alpha-prime-switch/alpha-prime-switch.component';
import {
  IAlphaPrimeSwitchOption
} from '../../../projects/alpha-prime/src/lib/components/alpha-prime-switch/alpha-prime-switch-option';

@Component({
  selector: 'app-switch',
  imports: [AlphaPrimeSwitchComponent],
  template: `
    <section>
      <h2>Alpha Prime - Switch Demo</h2>

      <div class="demo-grid">
        <div class="demo-card">
          <h3>Basic (On by default)</h3>
          <alpha-prime-switch
            [switchOption]="basicOption()"
            (switchOptionChange)="onBasicChange($event)"
          ></alpha-prime-switch>
          <p>Selected: <strong>{{ basicOption().selected ? 'true' : 'false' }}</strong></p>
        </div>

        <div class="demo-card">
          <h3>Initially Off</h3>
          <alpha-prime-switch
            [switchOption]="offOption()"
            (switchOptionChange)="onOffChange($event)"
          ></alpha-prime-switch>
          <p>Selected: <strong>{{ offOption().selected ? 'true' : 'false' }}</strong></p>
        </div>

        <div class="demo-card">
          <h3>Disabled</h3>
          <alpha-prime-switch
            [switchOption]="disabledOption()"
            [disabled]="true"
            (switchOptionChange)="onDisabledChange($event)"
          ></alpha-prime-switch>
          <p>Selected: <strong>{{ disabledOption().selected ? 'true' : 'false' }}</strong></p>
        </div>

        <div class="demo-card highlight">
          <h3>LocalStorage Persistence</h3>
          <alpha-prime-switch
            [switchOption]="persistedOption()"
            (switchOptionChange)="onPersistedChange($event)"
          ></alpha-prime-switch>
          <p>Selected: <strong>{{ persistedOption().selected ? 'true' : 'false' }}</strong></p>
          <p class="text-sm">Key: <code>{{ lsKey }}</code></p>
          <button class="toggle-btn" (click)="resetPersistence()">Reset persisted value</button>
        </div>
      </div>

      <div class="summary">
        <h3>Switch Summary</h3>
        <ul>
          <li>Basic: <strong>{{ basicOption().selected ? 'ON' : 'OFF' }}</strong></li>
          <li>Initially Off: <strong>{{ offOption().selected ? 'ON' : 'OFF' }}</strong></li>
          <li>Disabled: <strong>{{ disabledOption().selected ? 'ON' : 'OFF' }}</strong></li>
          <li>Persisted: <strong>{{ persistedOption().selected ? 'ON' : 'OFF' }}</strong></li>
        </ul>
      </div>
    </section>
  `,
  styleUrl: './styles/button-demo-common.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwitchComponent {
  readonly lsKey = 'demo-switch-ls';

  basicOption = signal<IAlphaPrimeSwitchOption>({
    id: 'basic',
    caption: 'Enable feature',
    selected: true
  });

  offOption = signal<IAlphaPrimeSwitchOption>({
    id: 'off',
    caption: 'Initially off option',
    selected: false
  });

  disabledOption = signal<IAlphaPrimeSwitchOption>({
    id: 'disabled',
    caption: 'Disabled switch',
    selected: true
  });

  persistedOption = signal<IAlphaPrimeSwitchOption>({
    id: 'persisted',
    caption: 'Persist this value',
    selected: localStorage.getItem(this.lsKey) === 'true',
    lsItemKey: this.lsKey
  });

  onBasicChange(option: IAlphaPrimeSwitchOption): void {
    this.basicOption.set(option);
  }

  onOffChange(option: IAlphaPrimeSwitchOption): void {
    this.offOption.set(option);
  }

  onDisabledChange(option: IAlphaPrimeSwitchOption): void {
    this.disabledOption.set(option);
  }

  onPersistedChange(option: IAlphaPrimeSwitchOption): void {
    this.persistedOption.set(option);
  }

  resetPersistence(): void {
    localStorage.removeItem(this.lsKey);
    this.persistedOption.set({
      id: 'persisted',
      caption: 'Persist this value',
      selected: false,
      lsItemKey: this.lsKey
    });
  }
}
