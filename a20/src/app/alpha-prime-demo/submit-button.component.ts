import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {
  AlphaPrimeSubmitButtonComponent
} from '../../../projects/alpha-prime/src/lib/components/alpha-prime-submit-button/alpha-prime-submit-button.component';
import {AlphaPrimeService} from '../../../projects/alpha-prime/src/lib/services/alpha-prime.service';
import {AlphaPrimeLabelComponent} from '../../../projects/alpha-prime/src/lib/components/alpha-prime-label/alpha-prime-label.component';

@Component({
  selector: 'app-alpha-prime-submit-button-demo',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime - Submit Button Demo</h2>

      @if (mouseEventMessage()) {
        <div class="mouse-event-message">
          <p>{{ mouseEventMessage() }}</p>
        </div>
      }

      <div class="demo-grid">
        <div class="demo-card">
          <h3>Icon-Only (Default)</h3>
          <p>Clicks: <strong>{{ iconOnlyClicks() }}</strong></p>
          <alpha-prime-submit-button
            (clicked)="onIconOnlyClicked()"
          ></alpha-prime-submit-button>
        </div>

        <div class="demo-card">
          <h3>With Label</h3>
          <p>Clicks: <strong>{{ withLabelClicks() }}</strong></p>
          <alpha-prime-submit-button
            [showLabel]="true"
            (clicked)="onWithLabelClicked()"
          ></alpha-prime-submit-button>
        </div>

        <div class="demo-card">
          <h3>Custom Caption</h3>
          <p>Clicks: <strong>{{ customClicks() }}</strong></p>
          <alpha-prime-submit-button
            [showLabel]="true"
            [caption]="'Submit Form'"
            (clicked)="onCustomClicked()"
          ></alpha-prime-submit-button>
        </div>

        <div class="demo-card">
          <h3>Small (Icon-only)</h3>
          <p>Clicks: <strong>{{ smallClicks() }}</strong></p>
          <alpha-prime-submit-button
            [sm]="true"
            (clicked)="onSmallClicked()"
          ></alpha-prime-submit-button>
        </div>

        <div class="demo-card">
          <h3>Small with Label</h3>
          <p>Clicks: <strong>{{ smallLabelClicks() }}</strong></p>
          <alpha-prime-submit-button
            [sm]="true"
            [showLabel]="true"
            (clicked)="onSmallLabelClicked()"
          ></alpha-prime-submit-button>
        </div>

        <div class="demo-card">
          <h3>Disabled</h3>
          <p>Clicks: <strong>{{ disabledClicks() }}</strong></p>
          <alpha-prime-submit-button
            [disabled]="true"
            [showLabel]="true"
            (clicked)="onDisabledClicked()"
          ></alpha-prime-submit-button>
        </div>

        <div class="demo-card">
          <h3>Busy State</h3>
          <p>Status: <strong>{{ busyMode() ? 'Submitting...' : 'Ready' }}</strong></p>
          <p>Clicks: <strong>{{ busyClicks() }}</strong></p>
          <alpha-prime-submit-button
            [busy]="busyMode()"
            [showLabel]="true"
            [disabled]="busyMode()"
            (clicked)="onBusyClicked()"
          ></alpha-prime-submit-button>
        </div>

        <div class="demo-card">
          <h3>Toggle showLabel</h3>
          <p>Mode: <strong>{{ toggleMode() ? 'With Label' : 'Icon-only' }}</strong></p>
          <p>Clicks: <strong>{{ toggleClicks() }}</strong></p>
          <button class="toggle-btn" (click)="toggleShowLabel()">
            Toggle Label
          </button>
          <br><br>
          <alpha-prime-submit-button
            [showLabel]="toggleMode()"
            (clicked)="onToggleClicked()"
          ></alpha-prime-submit-button>
        </div>

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
          <alpha-prime-submit-button
            [showLabel]="showLabelOption()"
            [sm]="smallOption()"
            [disabled]="disabledOption()"
            [busy]="busyOption()"
            [caption]="'Submit Data'"
            (clicked)="onAllOptionsClicked()"
          ></alpha-prime-submit-button>
        </div>
      </div>

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
  imports: [AlphaPrimeSubmitButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubmitButtonComponent implements OnInit, OnDestroy {
  private readonly mPs = inject(AlphaPrimeService);

  mouseEventMessage = signal('');

  iconOnlyClicks = signal(0);
  withLabelClicks = signal(0);
  customClicks = signal(0);
  smallClicks = signal(0);
  smallLabelClicks = signal(0);
  disabledClicks = signal(0);
  busyClicks = signal(0);
  toggleClicks = signal(0);
  allOptionsClicks = signal(0);

  toggleMode = signal(false);
  busyMode = signal(false);

  showLabelOption = signal(false);
  smallOption = signal(false);
  disabledOption = signal(false);
  busyOption = signal(false);

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
    this.sub = this.mPs.subscribe((payload: any) => {
      if (payload === true) {
        this.mouseEventMessage.set('Mouse entered the Submit Button');
      } else if (payload === false) {
        this.mouseEventMessage.set('Mouse left the Submit Button');
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
