import { AlphaPrimeEditButtonComponent }
  from '../../../projects/alpha-prime/src/lib/components/alpha-prime-edit-button/alpha-prime-edit-button.component';
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';

@Component({
  selector: 'app-alpha-prime-edit-button-demo',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime - Edit Button Demo</h2>

      <div class="demo-grid">
        <!-- Icon-only (Compact Mode - Default) -->
        <div class="demo-card">
          <h3>Icon-Only (Default)</h3>
          <p>Clicks: <strong>{{ iconOnlyClicks() }}</strong></p>
          <alpha-prime-edit-button
            (clicked)="onIconOnlyClicked()"
          ></alpha-prime-edit-button>
        </div>

        <!-- With Label -->
        <div class="demo-card">
          <h3>With Label</h3>
          <p>Clicks: <strong>{{ withLabelClicks() }}</strong></p>
          <alpha-prime-edit-button
            [showLabel]="true"
            (clicked)="onWithLabelClicked()"
          ></alpha-prime-edit-button>
        </div>

        <!-- Custom Caption -->
        <div class="demo-card">
          <h3>Custom Caption</h3>
          <p>Clicks: <strong>{{ customClicks() }}</strong></p>
          <alpha-prime-edit-button
            [showLabel]="true"
            [caption]="'Modify Item'"
            (clicked)="onCustomClicked()"
          ></alpha-prime-edit-button>
        </div>

        <!-- Small Size (Icon-only) -->
        <div class="demo-card">
          <h3>Small (Icon-only)</h3>
          <p>Clicks: <strong>{{ smallClicks() }}</strong></p>
          <alpha-prime-edit-button
            [sm]="true"
            (clicked)="onSmallClicked()"
          ></alpha-prime-edit-button>
        </div>

        <!-- Small Size with Label -->
        <div class="demo-card">
          <h3>Small with Label</h3>
          <p>Clicks: <strong>{{ smallLabelClicks() }}</strong></p>
          <alpha-prime-edit-button
            [sm]="true"
            [showLabel]="true"
            (clicked)="onSmallLabelClicked()"
          ></alpha-prime-edit-button>
        </div>

        <!-- Disabled -->
        <div class="demo-card">
          <h3>Disabled</h3>
          <p>Clicks: <strong>{{ disabledClicks() }}</strong></p>
          <alpha-prime-edit-button
            [disabled]="true"
            [showLabel]="true"
            (clicked)="onDisabledClicked()"
          ></alpha-prime-edit-button>
        </div>

        <!-- Toggle Demo -->
        <div class="demo-card">
          <h3>Toggle showLabel</h3>
          <p>Mode: <strong>{{ toggleMode() ? 'With Label' : 'Icon-only' }}</strong></p>
          <p>Clicks: <strong>{{ toggleClicks() }}</strong></p>
          <button class="toggle-btn" (click)="toggleShowLabel()">
            Toggle Label
          </button>
          <br><br>
          <alpha-prime-edit-button
            [showLabel]="toggleMode()"
            (clicked)="onToggleClicked()"
          ></alpha-prime-edit-button>
        </div>

        <!-- All Options Combined -->
        <div class="demo-card highlight">
          <h3>All Options Demo</h3>
          <p>Clicks: <strong>{{ allOptionsClicks() }}</strong></p>
          <div class="controls">
            <label>
              <input type="checkbox" [checked]="showLabelOption()"
                     (change)="toggleShowLabelOption()">
              Show Label
            </label>
            <label>
              <input type="checkbox" [checked]="smallOption()"
                     (change)="toggleSmallOption()">
              Small Size
            </label>
            <label>
              <input type="checkbox" [checked]="disabledOption()"
                     (change)="toggleDisabledOption()">
              Disabled
            </label>
          </div>
          <alpha-prime-edit-button
            [showLabel]="showLabelOption()"
            [sm]="smallOption()"
            [disabled]="disabledOption()"
            [caption]="'Interactive Demo'"
            (clicked)="onAllOptionsClicked()"
          ></alpha-prime-edit-button>
        </div>
      </div>

      <!-- Summary -->
      <div class="summary">
        <h3>Click Summary</h3>
        <ul>
          <li>Icon-only: <strong>{{ iconOnlyClicks() }}</strong></li>
          <li>With Label: <strong>{{ withLabelClicks() }}</strong></li>
          <li>Custom Caption: <strong>{{ customClicks() }}</strong></li>
          <li>Small: <strong>{{ smallClicks() }}</strong></li>
          <li>Small with Label: <strong>{{ smallLabelClicks() }}</strong></li>
          <li>Disabled: <strong>{{ disabledClicks() }}</strong></li>
          <li>Toggle: <strong>{{ toggleClicks() }}</strong></li>
          <li>All Options: <strong>{{ allOptionsClicks() }}</strong></li>
          <li><strong>Total: {{ totalClicks() }}</strong></li>
        </ul>
      </div>
    </section>
  `,
  styleUrl: './styles/button-demo-common.css',
  imports: [AlphaPrimeEditButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditButtonComponent {
  // Click counters
  iconOnlyClicks = signal(0);
  withLabelClicks = signal(0);
  customClicks = signal(0);
  smallClicks = signal(0);
  smallLabelClicks = signal(0);
  disabledClicks = signal(0);
  toggleClicks = signal(0);
  allOptionsClicks = signal(0);

  // Toggle state
  toggleMode = signal(false);

  // Interactive options
  showLabelOption = signal(false);
  smallOption = signal(false);
  disabledOption = signal(false);

  // Computed total
  totalClicks = () =>
    this.iconOnlyClicks() +
    this.withLabelClicks() +
    this.customClicks() +
    this.smallClicks() +
    this.smallLabelClicks() +
    this.disabledClicks() +
    this.toggleClicks() +
    this.allOptionsClicks();

  onIconOnlyClicked(): void {
    this.iconOnlyClicks.update(c => c + 1);
  }

  onWithLabelClicked(): void {
    this.withLabelClicks.update(c => c + 1);
  }

  onCustomClicked(): void {
    this.customClicks.update(c => c + 1);
  }

  onSmallClicked(): void {
    this.smallClicks.update(c => c + 1);
  }

  onSmallLabelClicked(): void {
    this.smallLabelClicks.update(c => c + 1);
  }

  onDisabledClicked(): void {
    this.disabledClicks.update(c => c + 1);
  }

  onToggleClicked(): void {
    this.toggleClicks.update(c => c + 1);
  }

  onAllOptionsClicked(): void {
    this.allOptionsClicks.update(c => c + 1);
  }

  toggleShowLabel(): void {
    this.toggleMode.update(v => !v);
  }

  toggleShowLabelOption(): void {
    this.showLabelOption.update(v => !v);
  }

  toggleSmallOption(): void {
    this.smallOption.update(v => !v);
  }

  toggleDisabledOption(): void {
    this.disabledOption.update(v => !v);
  }
}
