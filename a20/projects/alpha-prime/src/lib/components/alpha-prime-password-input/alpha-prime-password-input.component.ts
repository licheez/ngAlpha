import {ChangeDetectionStrategy, Component, computed, inject, input, model, signal} from '@angular/core';
import {AlphaPrimeService} from '../../services/alpha-prime.service';
import {InputGroup} from 'primeng/inputgroup';
import {Button} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'alpha-prime-password-input',
  standalone: true,
  imports: [
    InputGroup,
    Button,
    Ripple,
    FormsModule,
    InputText
  ],
  templateUrl: './alpha-prime-password-input.component.html',
  styleUrl: './alpha-prime-password-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlphaPrimePasswordInputComponent {

  private readonly mPs = inject(AlphaPrimeService);

  inputType = signal<'password' | 'text'>('password');

  name = input<string>(this.mPs.generateRandomName());
  disabled = input<boolean>(false);
  password = model<string | undefined>(undefined);

  empty = computed(
    () => this.password() === undefined
      || this.password()?.trim() === '');

  onShowHide(): void {
    this.inputType.update(type =>
      type === 'password' ? 'text' : 'password');
  }

  onPasswordChanged(password: string): void {
    this.password.set(password);
  }

}
