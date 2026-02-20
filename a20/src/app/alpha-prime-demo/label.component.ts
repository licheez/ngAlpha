import {ChangeDetectionStrategy, Component, model} from '@angular/core';
import { AlphaPrimeLabelComponent } from '../../../projects/alpha-prime/src/lib/components/alpha-prime-label/alpha-prime-label.component';
import { FormsModule } from '@angular/forms';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-label',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime - Label Demo</h2>

      <form novalidate autocomplete="off"
            class="p-fluid p-formgrid grid">

        <div class="p-field col-12">
          <alpha-prime-label
            [caption]="'Required Value'"
            [value]="dynamicValue()"></alpha-prime-label>
          <input
            name="field1"
            class="form-control"
            pInputText
            placeholder="Enter value"
            type="text"
            [(ngModel)]="dynamicValue"
          />
        </div>

      </form>

    </section>
  `,
  imports: [
    AlphaPrimeLabelComponent,
    FormsModule,
    InputText
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelComponent {

  // Interactive demo signals
  dynamicValue = model (''); // This will be bound to the input field
}
