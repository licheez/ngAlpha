import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { AlphaPrimeAddButtonComponent } from '../../../projects/alpha-prime/src/lib/components/alpha-prime-add-button/alpha-prime-add-button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alpha-prime-add-button-demo',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime - Add Button Demo</h2>
      <p>Clicked: {{ clicks() }}</p>

      <alpha-prime-add-button
        (clicked)="onClicked()"
      ></alpha-prime-add-button>
    </section>
  `,
  imports: [
    CommonModule,
    AlphaPrimeAddButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlphaPrimeAddButtonDemoComponent {
  protected readonly clicks = signal(0);

  onClicked(): void {
    this.clicks.update(c => c + 1);
  }

}
