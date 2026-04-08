import {ChangeDetectionStrategy, Component, signal, viewChild} from '@angular/core';
import {Popover} from 'primeng/popover';
import {OverlayPanelCompatComponent} from './overlay-panel-compat.component';

@Component({
  selector: 'app-overlay-demo',
  imports: [Popover, OverlayPanelCompatComponent],
  template: `
    <section class="overlay-demo">
      <h2>PrimeNG Overlay Demo</h2>

      <h3>Native p-popover (PrimeNG 20)</h3>
      <button type="button" class="trigger-button" (click)="onPopoverToggle($event)">
        Toggle p-popover
      </button>

      <p-popover>
        <div class="overlay-content">
          <p>Native popover content.</p>
          <p>Open count: <strong>{{ popoverOpenCount() }}</strong></p>
        </div>
      </p-popover>

      <h3>Legacy-compatible p-overlayPanel</h3>
      <button type="button" class="trigger-button"
              (click)="onOverlayPanelToggle($event, legacyPanel)">
        Toggle p-overlayPanel
      </button>

      <p-overlayPanel #legacyPanel="pOverlayPanel">
        <div class="overlay-content">
          <p>Compatibility wrapper content.</p>
          <p>Open count: <strong>{{ overlayPanelOpenCount() }}</strong></p>
        </div>
      </p-overlayPanel>
    </section>
  `,
  styles: [
    `
      .overlay-demo {
        display: grid;
        gap: 0.75rem;
        max-width: 32rem;
      }

      .trigger-button,
      .close-button {
        padding: 0.5rem 0.75rem;
        border-radius: 0.375rem;
        border: 1px solid #cbd5e1;
        background: #fff;
        cursor: pointer;
      }

      .overlay-content {
        display: grid;
        gap: 0.5rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayDemoComponent {
  protected readonly popoverOpenCount = signal(0);
  protected readonly overlayPanelOpenCount = signal(0);
  private readonly popover = viewChild.required(Popover);

  protected onPopoverToggle(event: Event): void {
    this.popoverOpenCount.update(v => v + 1);
    this.popover().toggle(event);
  }

  protected onOverlayPanelToggle(event: Event, panel: OverlayPanelCompatComponent): void {
    this.overlayPanelOpenCount.update(v => v + 1);
    panel.toggle(event);
  }
}

