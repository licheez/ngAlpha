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
            [caption]="'Required Value (using [caption])'"
            [value]="dynamicValue1()"></alpha-prime-label>
          <input
            name="field1"
            class="form-control"
            pInputText
            placeholder="Enter value"
            type="text"
            [(ngModel)]="dynamicValue1"
          />
        </div>

        <div class="p-field col-12">
          <alpha-prime-label [value]="dynamicValue2()">
            Required Value (using ng-content)
          </alpha-prime-label>
          <input
            name="field2"
            class="form-control"
            pInputText
            placeholder="Enter value"
            type="text"
            [(ngModel)]="dynamicValue2"
          />
        </div>

        <div class="p-field col-12">
          <alpha-prime-label
            [value]="dynamicValue3()"
            [showMessage]="true"
            [invalidMessage]="'This field is mandatory!'">
            Field with Custom Error Message
          </alpha-prime-label>
          <input
            name="field3"
            class="form-control"
            pInputText
            placeholder="Enter value"
            type="text"
            [(ngModel)]="dynamicValue3"
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
  // This will be bound to the input field with [caption]
  dynamicValue1 = model ('');
  // This will be bound to the input field with ng-content
  dynamicValue2 = model('');
  // This will be bound to the input field with custom error message
  dynamicValue3 = model('');
}
