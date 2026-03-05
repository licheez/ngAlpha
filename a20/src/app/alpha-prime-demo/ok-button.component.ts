import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { AlphaPrimeOkButton } from '../../../projects/alpha-prime/src/lib/components/alpha-prime-ok-button/alpha-prime-ok-button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alpha-prime-ok-button-demo',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime - OK Button Demo</h2>

      <div class="demo-section">
        <h3>Basic OK Button</h3>
        <p>Clicks: <strong>{{ clicks() }}</strong></p>
        <alpha-prime-ok-button
          (clicked)="onClicked()"
        ></alpha-prime-ok-button>
      </div>

      <div class="demo-section">
        <h3>OK Button with Custom Caption</h3>
        <p>Clicks: <strong>{{ customCaptionClicks() }}</strong></p>
        <alpha-prime-ok-button
          [caption]="'Confirm'"
          (clicked)="onCustomCaptionClicked()"
        ></alpha-prime-ok-button>
      </div>

      <div class="demo-section">
        <h3>Small OK Button</h3>
        <p>Clicks: <strong>{{ smallClicks() }}</strong></p>
        <alpha-prime-ok-button
          [sm]="true"
          (clicked)="onSmallClicked()"
        ></alpha-prime-ok-button>
      </div>

      <div class="demo-section">
        <h3>Small OK Button with Custom Caption</h3>
        <p>Clicks: <strong>{{ smallCustomClicks() }}</strong></p>
        <alpha-prime-ok-button
          [caption]="'Accept'"
          [sm]="true"
          (clicked)="onSmallCustomClicked()"
        ></alpha-prime-ok-button>
      </div>

      <div class="demo-section">
        <h3>Disabled OK Button</h3>
        <p>Clicks: <strong>{{ disabledClicks() }}</strong></p>
        <alpha-prime-ok-button
          [disabled]="true"
          (clicked)="onDisabledClicked()"
        ></alpha-prime-ok-button>
      </div>

      <div class="demo-section">
        <h3>Toggle Disabled State</h3>
        <p>Clicks: <strong>{{ toggleClicks() }}</strong></p>
        <button (click)="toggleDisabled()" style="margin-bottom: 0.5rem;">
          Toggle Disabled ({{ isDisabled() ? 'Currently Disabled' : 'Currently Enabled' }})
        </button>
        <alpha-prime-ok-button
          [disabled]="isDisabled()"
          (clicked)="onToggleClicked()"
        ></alpha-prime-ok-button>
      </div>

      <div class="demo-section">
        <h3>Demo Summary</h3>
        <ul>
          <li>Basic Button Clicks: <strong>{{ clicks() }}</strong></li>
          <li>Custom Caption Clicks: <strong>{{ customCaptionClicks() }}</strong></li>
          <li>Small Button Clicks: <strong>{{ smallClicks() }}</strong></li>
          <li>Small Custom Clicks: <strong>{{ smallCustomClicks() }}</strong></li>
          <li>Disabled Button Clicks: <strong>{{ disabledClicks() }}</strong></li>
          <li>Toggle Button Clicks: <strong>{{ toggleClicks() }}</strong></li>
          <li>Total Clicks: <strong>{{ totalClicks() }}</strong></li>
        </ul>
      </div>
    </section>
  `,
  styles: [`
    h2 {
      margin-bottom: 2rem;
    }

    h3 {
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .demo-section {
      margin-bottom: 2rem;
      padding: 1rem;
      border-radius: 0.5rem;
      background-color: rgba(0, 0, 0, 0.02);
    }

    p {
      margin: 0.5rem 0;
      font-size: 0.95rem;
    }

    button {
      padding: 0.5rem 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.9rem;
    }

    button:hover {
      background-color: #0056b3;
    }

    button:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      padding: 0.25rem 0;
      font-size: 0.95rem;
    }
  `],
  imports: [
    CommonModule,
    AlphaPrimeOkButton
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OkButtonComponent {
  // Click counters for different button variations
  clicks = signal(0);
  customCaptionClicks = signal(0);
  smallClicks = signal(0);
  smallCustomClicks = signal(0);
  disabledClicks = signal(0);
  toggleClicks = signal(0);

  // Disabled state toggle
  isDisabled = signal(false);

  // Computed total clicks
  totalClicks = () =>
    this.clicks() +
    this.customCaptionClicks() +
    this.smallClicks() +
    this.smallCustomClicks() +
    this.disabledClicks() +
    this.toggleClicks();

  onClicked(): void {
    this.clicks.update(c => c + 1);
  }

  onCustomCaptionClicked(): void {
    this.customCaptionClicks.update(c => c + 1);
  }

  onSmallClicked(): void {
    this.smallClicks.update(c => c + 1);
  }

  onSmallCustomClicked(): void {
    this.smallCustomClicks.update(c => c + 1);
  }

  onDisabledClicked(): void {
    this.disabledClicks.update(c => c + 1);
  }

  onToggleClicked(): void {
    this.toggleClicks.update(c => c + 1);
  }

  toggleDisabled(): void {
    this.isDisabled.update(d => !d);
  }
}
