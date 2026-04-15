import {ChangeDetectionStrategy, Component, model} from '@angular/core';
import {AlphaPrimePasswordInputComponent}
  from '../../../projects/alpha-prime/src/lib/components/alpha-prime-password-input/alpha-prime-password-input.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-password-input',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime - Password Input Demo</h2>

      <form novalidate autocomplete="off"
            class="p-fluid p-formgrid grid">

        <div class="p-field col-12 md:col-6">
          <label for="pwd1">Basic Password Input</label>
          <alpha-prime-password-input
            [name]="'pwd1'"
            [(password)]="password1"
          />
          <small class="block mt-2">Password: {{ password1() || '(empty)' }}</small>
        </div>

        <div class="p-field col-12 md:col-6">
          <label for="pwd2">Disabled Password Input</label>
          <alpha-prime-password-input
            [name]="'pwd2'"
            [disabled]="true"
            [(password)]="password2"
          />
        </div>

        <div class="p-field col-12 md:col-6">
          <label for="pwd3">Password with Initial Value</label>
          <alpha-prime-password-input
            [name]="'pwd3'"
            [(password)]="password3"
          />
          <small class="block mt-2">Password length: {{ password3()?.length || 0 }}</small>
        </div>

        <div class="p-field col-12 md:col-6">
          <label for="pwd4">Interactive Password</label>
          <alpha-prime-password-input
            [name]="'pwd4'"
            [(password)]="password4"
          />
          <button
            type="button"
            class="p-button mt-2"
            (click)="clearPassword()">
            Clear Password
          </button>
        </div>

      </form>

    </section>
  `,
  imports: [
    AlphaPrimePasswordInputComponent,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordInputComponent {

  // Interactive demo signals
  password1 = model<string | undefined>(undefined);
  password2 = model<string | undefined>('DisabledPassword123');
  password3 = model<string | undefined>('InitialValue123');
  password4 = model<string | undefined>(undefined);

  clearPassword(): void {
    this.password4.set(undefined);
  }
}
