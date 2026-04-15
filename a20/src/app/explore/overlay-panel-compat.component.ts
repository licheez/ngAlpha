import {ChangeDetectionStrategy, Component, viewChild} from '@angular/core';
import {Popover} from 'primeng/popover';

@Component({
  selector: 'p-overlayPanel, p-overlaypanel',
  exportAs: 'pOverlayPanel',
  imports: [Popover],
  template: `
    <p-popover>
      <ng-content></ng-content>
    </p-popover>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayPanelCompatComponent {
  private readonly popover = viewChild.required(Popover);

  toggle(event: Event, target?: EventTarget | null): void {
    this.popover().toggle(event, target);
  }

  show(event: Event, target?: EventTarget | null): void {
    this.popover().show(event, target);
  }

  hide(): void {
    this.popover().hide();
  }
}

