import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  AlphaPrimeSelectComponent
} from '../../../projects/alpha-prime/src/lib/components/alpha-prime-select/alpha-prime-select.component';
import {
  AlphaPrimeSelectInfo,
  IAlphaPrimeSelectOption
} from '../../../projects/alpha-prime/src/lib/components/alpha-prime-select/alpha-prime-select-info';

@Component({
  selector: 'app-select',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime - Select Demo</h2>

      <div class="demo-grid">

        <!-- Basic Select (First option selected by default) -->
        <div class="demo-card">
          <h3>Basic Select (First)</h3>
          <p>Selected: <strong>{{ basicSelectedCaption() }}</strong></p>
          <alpha-prime-select
            [asi]="basicAsi()"
            [placeholder]="'Choose an option'"
            (optionChange)="onBasicChange($event)"
          ></alpha-prime-select>
        </div>

        <!-- Select with No Default Selection -->
        <div class="demo-card">
          <h3>No Default Selection</h3>
          <p>Selected: <strong>{{ noneSelectedCaption() }}</strong></p>
          <alpha-prime-select
            [asi]="noneAsi()"
            [placeholder]="'Select an item...'"
            (optionChange)="onNoneChange($event)"
          ></alpha-prime-select>
        </div>

        <!-- Select with Clear Button -->
        <div class="demo-card">
          <h3>With Clear Button</h3>
          <p>Selected: <strong>{{ clearSelectedCaption() }}</strong></p>
          <alpha-prime-select
            [asi]="clearAsi()"
            [placeholder]="'Select a fruit...'"
            [showClear]="true"
            (optionChange)="onClearChange($event)"
          ></alpha-prime-select>
        </div>

        <!-- Select with Add Button -->
        <div class="demo-card">
          <h3>With Add Button</h3>
          <p>Selected: <strong>{{ addSelectedCaption() }}</strong></p>
          <p>Add Clicks: <strong>{{ addClicks() }}</strong></p>
          <alpha-prime-select
            [asi]="addAsi()"
            [placeholder]="'Select a color...'"
            [showAdd]="true"
            (optionChange)="onAddChange($event)"
            (addClicked)="onAddClicked()"
          ></alpha-prime-select>
        </div>

        <!-- Select with Clear AND Add Buttons -->
        <div class="demo-card">
          <h3>Clear + Add Buttons</h3>
          <p>Selected: <strong>{{ bothSelectedCaption() }}</strong></p>
          <p>Add Clicks: <strong>{{ bothAddClicks() }}</strong></p>
          <alpha-prime-select
            [asi]="bothAsi()"
            [placeholder]="'Select a priority...'"
            [showClear]="true"
            [showAdd]="true"
            (optionChange)="onBothChange($event)"
            (addClicked)="onBothAddClicked()"
          ></alpha-prime-select>
        </div>

        <!-- Disabled Select -->
        <div class="demo-card">
          <h3>Disabled Select</h3>
          <p>Selected: <strong>{{ disabledSelectedCaption() }}</strong></p>
          <alpha-prime-select
            [asi]="disabledAsi()"
            [disabled]="true"
            [placeholder]="'Cannot interact'"
          ></alpha-prime-select>
        </div>

        <!-- Readonly Select -->
        <div class="demo-card">
          <h3>Readonly Mode</h3>
          <p>Displayed Text: <strong>{{ readonlyCaption() }}</strong></p>
          <alpha-prime-select
            [readonly]="true"
            [readonlyCaption]="readonlyCaption()"
          ></alpha-prime-select>
        </div>

        <!-- Select with LocalStorage Persistence -->
        <div class="demo-card highlight">
          <h3>LocalStorage Persistence</h3>
          <p>Selected: <strong>{{ lsSelectedCaption() }}</strong></p>
          <p class="text-sm">This selection is persisted to <code>localStorage</code> with key: <code>demo-select-ls</code></p>
          <alpha-prime-select
            [asi]="lsAsi()"
            [placeholder]="'Choose a language...'"
            [showClear]="true"
            (optionChange)="onLsChange($event)"
          ></alpha-prime-select>
        </div>

        <!-- Interactive Options Demo -->
        <div class="demo-card highlight">
          <h3>Interactive Options Demo</h3>
          <p>Selected: <strong>{{ interactiveSelectedCaption() }}</strong></p>
          <div class="controls">
            <label>
              <input type="checkbox" [checked]="showClearOption()"
                     (change)="toggleShowClear()">
              Show Clear
            </label>
            <label>
              <input type="checkbox" [checked]="showAddOption()"
                     (change)="toggleShowAdd()">
              Show Add
            </label>
            <label>
              <input type="checkbox" [checked]="disabledOption()"
                     (change)="toggleDisabled()">
              Disabled
            </label>
            <label>
              <input type="checkbox" [checked]="readonlyOption()"
                     (change)="toggleReadonly()">
              Readonly
            </label>
          </div>
          @if (readonlyOption()) {
            <alpha-prime-select
              [readonly]="true"
              [readonlyCaption]="interactiveSelectedCaption()"
            ></alpha-prime-select>
          } @else {
            <alpha-prime-select
              [asi]="interactiveAsi()"
              [placeholder]="'Interactive select...'"
              [showClear]="showClearOption()"
              [showAdd]="showAddOption()"
              [disabled]="disabledOption()"
              (optionChange)="onInteractiveChange($event)"
              (addClicked)="onInteractiveAddClicked()"
            ></alpha-prime-select>
          }
          <p class="text-sm">Add Clicks: <strong>{{ interactiveAddClicks() }}</strong></p>
        </div>

        <!-- Options with Disabled Items -->
        <div class="demo-card">
          <h3>With Disabled Options</h3>
          <p>Selected: <strong>{{ disabledItemsSelectedCaption() }}</strong></p>
          <p class="text-sm">"Option B" and "Option D" are disabled</p>
          <alpha-prime-select
            [asi]="disabledItemsAsi()"
            [placeholder]="'Select an option...'"
            [showClear]="true"
            (optionChange)="onDisabledItemsChange($event)"
          ></alpha-prime-select>
        </div>

      </div>

      <!-- Summary -->
      <div class="summary">
        <h3>Selection Summary</h3>
        <ul>
          <li>Basic (First): <strong>{{ basicSelectedCaption() }}</strong></li>
          <li>None Default: <strong>{{ noneSelectedCaption() }}</strong></li>
          <li>With Clear: <strong>{{ clearSelectedCaption() }}</strong></li>
          <li>With Add: <strong>{{ addSelectedCaption() }}</strong> (Clicks: {{ addClicks() }})</li>
          <li>Both Buttons: <strong>{{ bothSelectedCaption() }}</strong> (Clicks: {{ bothAddClicks() }})</li>
          <li>Disabled: <strong>{{ disabledSelectedCaption() }}</strong></li>
          <li>LocalStorage: <strong>{{ lsSelectedCaption() }}</strong></li>
          <li>Interactive: <strong>{{ interactiveSelectedCaption() }}</strong> (Clicks: {{ interactiveAddClicks() }})</li>
          <li>Disabled Items: <strong>{{ disabledItemsSelectedCaption() }}</strong></li>
        </ul>
        <p><strong>Total Add Button Clicks: {{ totalAddClicks() }}</strong></p>
      </div>
    </section>
  `,
  styleUrl: './styles/button-demo-common.css',
  imports: [AlphaPrimeSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent {
  // Sample options
  private readonly countriesOptions: IAlphaPrimeSelectOption[] = [
    { id: '1', caption: 'Belgium', disabled: false },
    { id: '2', caption: 'France', disabled: false },
    { id: '3', caption: 'Germany', disabled: false },
    { id: '4', caption: 'Netherlands', disabled: false },
    { id: '5', caption: 'Spain', disabled: false }
  ];

  private readonly fruitsOptions: IAlphaPrimeSelectOption[] = [
    { id: 'apple', caption: 'Apple', disabled: false },
    { id: 'banana', caption: 'Banana', disabled: false },
    { id: 'cherry', caption: 'Cherry', disabled: false },
    { id: 'orange', caption: 'Orange', disabled: false }
  ];

  private readonly colorsOptions: IAlphaPrimeSelectOption[] = [
    { id: 'red', caption: 'Red', disabled: false },
    { id: 'green', caption: 'Green', disabled: false },
    { id: 'blue', caption: 'Blue', disabled: false },
    { id: 'yellow', caption: 'Yellow', disabled: false }
  ];

  private readonly prioritiesOptions: IAlphaPrimeSelectOption[] = [
    { id: 'low', caption: 'Low Priority', disabled: false },
    { id: 'medium', caption: 'Medium Priority', disabled: false },
    { id: 'high', caption: 'High Priority', disabled: false },
    { id: 'critical', caption: 'Critical', disabled: false }
  ];

  private readonly languagesOptions: IAlphaPrimeSelectOption[] = [
    { id: 'en', caption: 'English', disabled: false },
    { id: 'fr', caption: 'French', disabled: false },
    { id: 'de', caption: 'German', disabled: false },
    { id: 'es', caption: 'Spanish', disabled: false },
    { id: 'nl', caption: 'Dutch', disabled: false }
  ];

  private readonly statusOptions: IAlphaPrimeSelectOption[] = [
    { id: 'active', caption: 'Active', disabled: false },
    { id: 'pending', caption: 'Pending', disabled: false },
    { id: 'completed', caption: 'Completed', disabled: false },
    { id: 'cancelled', caption: 'Cancelled', disabled: false }
  ];

  private readonly disabledItemsOptions: IAlphaPrimeSelectOption[] = [
    { id: 'a', caption: 'Option A', disabled: false },
    { id: 'b', caption: 'Option B', disabled: true },
    { id: 'c', caption: 'Option C', disabled: false },
    { id: 'd', caption: 'Option D', disabled: true },
    { id: 'e', caption: 'Option E', disabled: false }
  ];

  // AlphaPrimeSelectInfo instances
  basicAsi = signal(AlphaPrimeSelectInfo.First(this.countriesOptions));
  noneAsi = signal(AlphaPrimeSelectInfo.None(this.countriesOptions));
  clearAsi = signal(AlphaPrimeSelectInfo.First(this.fruitsOptions));
  addAsi = signal(AlphaPrimeSelectInfo.First(this.colorsOptions));
  bothAsi = signal(AlphaPrimeSelectInfo.First(this.prioritiesOptions));
  disabledAsi = signal(AlphaPrimeSelectInfo.First(this.countriesOptions));
  lsAsi = signal(AlphaPrimeSelectInfo.LsOrFirst(this.languagesOptions, 'demo-select-ls'));
  interactiveAsi = signal(AlphaPrimeSelectInfo.First(this.statusOptions));
  disabledItemsAsi = signal(AlphaPrimeSelectInfo.First(this.disabledItemsOptions));

  // Selected captions
  basicSelectedCaption = signal<string>('Belgium');
  noneSelectedCaption = signal<string>('None');
  clearSelectedCaption = signal<string>('Apple');
  addSelectedCaption = signal<string>('Red');
  bothSelectedCaption = signal<string>('Low Priority');
  disabledSelectedCaption = signal<string>('Belgium');
  lsSelectedCaption = signal<string>('English');
  interactiveSelectedCaption = signal<string>('Active');
  disabledItemsSelectedCaption = signal<string>('Option A');

  // Readonly caption
  readonlyCaption = signal<string>('Read-only Display Value');

  // Add button click counters
  addClicks = signal(0);
  bothAddClicks = signal(0);
  interactiveAddClicks = signal(0);

  // Interactive options
  showClearOption = signal(true);
  showAddOption = signal(true);
  disabledOption = signal(false);
  readonlyOption = signal(false);

  // Computed total
  totalAddClicks = () =>
    this.addClicks() +
    this.bothAddClicks() +
    this.interactiveAddClicks();

  onBasicChange(option: IAlphaPrimeSelectOption | undefined): void {
    this.basicSelectedCaption.set(option?.caption ?? 'None');
  }

  onNoneChange(option: IAlphaPrimeSelectOption | undefined): void {
    this.noneSelectedCaption.set(option?.caption ?? 'None');
  }

  onClearChange(option: IAlphaPrimeSelectOption | undefined): void {
    this.clearSelectedCaption.set(option?.caption ?? 'None');
  }

  onAddChange(option: IAlphaPrimeSelectOption | undefined): void {
    this.addSelectedCaption.set(option?.caption ?? 'None');
  }

  onAddClicked(): void {
    this.addClicks.update(c => c + 1);
  }

  onBothChange(option: IAlphaPrimeSelectOption | undefined): void {
    this.bothSelectedCaption.set(option?.caption ?? 'None');
  }

  onBothAddClicked(): void {
    this.bothAddClicks.update(c => c + 1);
  }

  onLsChange(option: IAlphaPrimeSelectOption | undefined): void {
    this.lsSelectedCaption.set(option?.caption ?? 'None');
  }

  onInteractiveChange(option: IAlphaPrimeSelectOption | undefined): void {
    this.interactiveSelectedCaption.set(option?.caption ?? 'None');
  }

  onInteractiveAddClicked(): void {
    this.interactiveAddClicks.update(c => c + 1);
  }

  onDisabledItemsChange(option: IAlphaPrimeSelectOption | undefined): void {
    this.disabledItemsSelectedCaption.set(option?.caption ?? 'None');
  }

  toggleShowClear(): void {
    this.showClearOption.update(v => !v);
  }

  toggleShowAdd(): void {
    this.showAddOption.update(v => !v);
  }

  toggleDisabled(): void {
    this.disabledOption.update(v => !v);
  }

  toggleReadonly(): void {
    this.readonlyOption.update(v => !v);
  }
}

