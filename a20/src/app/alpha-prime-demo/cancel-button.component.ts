import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { AlphaPrimeCancelButtonComponent } from '../../../projects/alpha-prime/src/lib/components/alpha-prime-cancel-button/alpha-prime-cancel-button.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-alpha-prime-add-cancel-demo',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime - Cancel Button Demo</h2>
      <p>Clicked: {{ clicks() }}</p>
      <alpha-prime-cancel-button
          (clicked)="onClicked()"
      ></alpha-prime-cancel-button>
    </section>
  `,
  imports: [
    CommonModule,
    AlphaPrimeCancelButtonComponent
    ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlphaPrimeAddButtonDemoComponent {
  protected readonly clicks = signal(0);

  onClicked(): void {
    this.clicks.update(c => c + 1);
  }

}
