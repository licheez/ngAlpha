import {Component, ChangeDetectionStrategy, signal, OnInit, inject, OnDestroy} from '@angular/core';
import { AlphaPrimeSaveButton } from '../../../projects/alpha-prime/src/lib/components/alpha-prime-save-button/alpha-prime-save-button';
import {AlphaPrimeService} from '../../../projects/alpha-prime/src/lib/services/alpha-prime.service';
import {AlphaPrimeLabelComponent} from '../../../projects/alpha-prime/src/lib/components/alpha-prime-label/alpha-prime-label.component';

@Component({
  selector: 'app-alpha-prime-save-button-demo',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime - Save Button Demo</h2>

      <!-- Mouse Event Message -->
      @if (mouseEventMessage()) {
        <div class="mouse-event-message">
          <p>{{ mouseEventMessage() }}</p>
        </div>
      }

      <div class="demo-grid">
        <!-- Icon-only (Compact Mode - Default) -->
        <div class="demo-card">
          <h3>Icon-Only (Default)</h3>
          <p>Clicks: <strong>{{ iconOnlyClicks() }}</strong></p>
          <alpha-prime-save-button
            (clicked)="onIconOnlyClicked()"
          ></alpha-prime-save-button>
        </div>

        <!-- With Label -->
        <div class="demo-card">
          <h3>With Label</h3>
          <p>Clicks: <strong>{{ withLabelClicks() }}</strong></p>
          <alpha-prime-save-button
            [showLabel]="true"
            (clicked)="onWithLabelClicked()"
          ></alpha-prime-save-button>
        </div>

        <!-- Custom Caption -->
        <div class="demo-card">
          <h3>Custom Caption</h3>
          <p>Clicks: <strong>{{ customClicks() }}</strong></p>
          <alpha-prime-save-button
            [showLabel]="true"
            [caption]="'Save Changes'"
            (clicked)="onCustomClicked()"
          ></alpha-prime-save-button>
        </div>

        <!-- Small Size (Icon-only) -->
        <div class="demo-card">
          <h3>Small (Icon-only)</h3>
          <p>Clicks: <strong>{{ smallClicks() }}</strong></p>
          <alpha-prime-save-button
            [sm]="true"
            (clicked)="onSmallClicked()"
          ></alpha-prime-save-button>
        </div>

        <!-- Small Size with Label -->
        <div class="demo-card">
          <h3>Small with Label</h3>
          <p>Clicks: <strong>{{ smallLabelClicks() }}</strong></p>
          <alpha-prime-save-button
            [sm]="true"
            [showLabel]="true"
            (clicked)="onSmallLabelClicked()"
          ></alpha-prime-save-button>
        </div>

        <!-- Disabled -->
        <div class="demo-card">
          <h3>Disabled</h3>
          <p>Clicks: <strong>{{ disabledClicks() }}</strong></p>
          <alpha-prime-save-button
            [disabled]="true"
            [showLabel]="true"
            (clicked)="onDisabledClicked()"
          ></alpha-prime-save-button>
        </div>

        <!-- Busy State -->
        <div class="demo-card">
          <h3>Busy State</h3>
          <p>Status: <strong>{{ busyMode() ? 'Saving...' : 'Ready' }}</strong></p>
          <p>Clicks: <strong>{{ busyClicks() }}</strong></p>
          <alpha-prime-save-button
            [busy]="busyMode()"
            [showLabel]="true"
            [disabled]="busyMode()"
            (clicked)="onBusyClicked()"
          ></alpha-prime-save-button>
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
          <alpha-prime-save-button
            [showLabel]="toggleMode()"
            (clicked)="onToggleClicked()"
          ></alpha-prime-save-button>
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
            <label>
              <input type="checkbox" [checked]="busyOption()"
                     (change)="toggleBusyOption()">
              Busy
            </label>
          </div>
          <alpha-prime-save-button
            [showLabel]="showLabelOption()"
            [sm]="smallOption()"
            [disabled]="disabledOption()"
            [busy]="busyOption()"
            [caption]="'Save Data'"
            (clicked)="onAllOptionsClicked()"
          ></alpha-prime-save-button>
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
          <li>Busy: <strong>{{ busyClicks() }}</strong></li>
          <li>Toggle: <strong>{{ toggleClicks() }}</strong></li>
          <li>All Options: <strong>{{ allOptionsClicks() }}</strong></li>
          <li><strong>Total: {{ totalClicks() }}</strong></li>
        </ul>
      </div>
    </section>
  `,
  styleUrl: './styles/button-demo-common.css',
  imports: [AlphaPrimeSaveButton],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaveButtonComponent implements OnInit, OnDestroy {
  private readonly mPs = inject(AlphaPrimeService);

  // Message for mouse enter/leave events
  mouseEventMessage = signal('');

  // Click counters
  iconOnlyClicks = signal(0);
  withLabelClicks = signal(0);
  customClicks = signal(0);
  smallClicks = signal(0);
  smallLabelClicks = signal(0);
  disabledClicks = signal(0);
  busyClicks = signal(0);
  toggleClicks = signal(0);
  allOptionsClicks = signal(0);

  // Toggle states
  toggleMode = signal(false);
  busyMode = signal(false);

  // Interactive options
  showLabelOption = signal(false);
  smallOption = signal(false);
  disabledOption = signal(false);
  busyOption = signal(false);

  // Computed total
  totalClicks = () =>
    this.iconOnlyClicks() +
    this.withLabelClicks() +
    this.customClicks() +
    this.smallClicks() +
    this.smallLabelClicks() +
    this.disabledClicks() +
    this.busyClicks() +
    this.toggleClicks() +
    this.allOptionsClicks();

  private sub = -1;

  ngOnInit(): void {
    // Subscribe to SHOW_MESSAGE channel to listen for mouse enter/leave events
    this.sub = this.mPs.subscribe((payload: any) => {
      if (payload === true) {
        this.mouseEventMessage.set('🖱️ Mouse entered the Save Button');
      } else if (payload === false) {
        this.mouseEventMessage.set('🖱️ Mouse left the Save Button');
      }
    }, AlphaPrimeLabelComponent.SHOW_MESSAGE);
  }

  ngOnDestroy(): void {
    if (this.sub !== -1) {
      this.mPs.unsubscribe(this.sub);
    }
  }

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

  onBusyClicked(): void {
    this.busyClicks.update(c => c + 1);
    this.busyMode.set(true);
    setTimeout(() => {
      this.busyMode.set(false);
    }, 2000);
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

  toggleBusyOption(): void {
    this.busyOption.update(v => !v);
  }
}
