import { AlphaPrimeEditButtonComponent }
  from '../../../projects/alpha-prime/src/lib/components/alpha-prime-edit-button/alpha-prime-edit-button.component';
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-alpha-prime-edit-button-demo',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime - Edit Button Demo</h2>
      <p>Clicked: {{ clicks() }}</p>

      <alpha-prime-edit-button
          (clicked)="onClicked()"
      ></alpha-prime-edit-button>
    </section>
  `,
  imports: [
    CommonModule,
    AlphaPrimeEditButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditButtonComponent {

  protected readonly clicks = signal(0);

  onClicked(): void {
    this.clicks.update(c => c + 1);
  }

}
