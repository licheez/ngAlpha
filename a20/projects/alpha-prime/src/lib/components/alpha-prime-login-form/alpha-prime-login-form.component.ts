import {ChangeDetectionStrategy, Component, computed, input, inject, output, signal} from '@angular/core';
import {AlphaPrimeService} from '../../services/alpha-prime.service';
import {AlphaPrimeDebugTagComponent} from '../alpha-prime-debug-tag/alpha-prime-debug-tag.component';
import {AlphaPrimeLabelComponent} from '../alpha-prime-label/alpha-prime-label.component';
import {AlphaPrimePasswordInputComponent} from '../alpha-prime-password-input/alpha-prime-password-input.component';
import {AlphaPrimeProgressBarComponent} from '../alpha-prime-progress-bar/alpha-prime-progress-bar.component';
import {AlphaPrimeCancelButtonComponent} from '../alpha-prime-cancel-button/alpha-prime-cancel-button.component';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {FormsModule} from '@angular/forms';

class FormModel {
  username = signal('');
  password =
    signal<string | undefined>(undefined);

  private isEmpty(value: string | undefined): boolean {
    return value === undefined || value.trim() === '';
  }

  invalid = computed(() => {
    return this.isEmpty(this.username())
      || this.isEmpty(this.password());
  });
}

@Component({
  selector: 'alpha-prime-login-form',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    AlphaPrimeLabelComponent,
    AlphaPrimePasswordInputComponent,
    AlphaPrimeProgressBarComponent,
    AlphaPrimeCancelButtonComponent,
    InputText,
    Button,
    Ripple,
    FormsModule
  ],
  templateUrl: './alpha-prime-login-form.component.html',
  styleUrl: './alpha-prime-login-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlphaPrimeLoginFormComponent {

  private readonly mPs = inject(AlphaPrimeService);

  // Input signals for configuration
  showCancelButton = input(false);
  usernameLabel = input<string | undefined>(undefined);
  passwordLabel = input<string | undefined>(undefined);
  failureMessage = input<string | undefined>(undefined);
  invalidCredentialsMessage = input<string | undefined>(undefined);
  connectLabel = input<string | undefined>(undefined);

  // Internal state
  fm: FormModel = new FormModel();
  busy = signal(false);
  errorMessage = signal<string | undefined>(undefined);

  // Output events
  loggedIn = output();
  cancelled = output();

  // Computed label values with defaults from service
  usernameLit = computed(
    () => this.usernameLabel() ?? this.mPs.getTr('alpha.common.username')
  );

  passwordLit = computed(
    () => this.passwordLabel() ?? this.mPs.getTr('alpha.common.password')
  );

  failureLit = computed(
    () => this.failureMessage() ?? this.mPs.getTr('alpha.common.failure')
  );

  invalidCredentialsLit = computed(
    () => this.invalidCredentialsMessage() ?? this.mPs.getTr('alpha.common.invalidCredentials')
  );

  connectLabelLit = computed(
    () => this.connectLabel() ?? this.mPs.getTr('alpha.loginForm.connect')
  );

  onCancel() {
    this.cancelled.emit();
  }

  onSubmit() {
    this.busy.set(true);
    this.errorMessage.set(undefined);
    this.mPs.signIn(
      this.fm.username(), this.fm.password() ?? '', true)
      .subscribe({
        next: ok => {
          if (ok) {
            this.loggedIn.emit();
          } else {
            this.errorMessage.set(this.invalidCredentialsLit());
          }
          this.busy.set(false);
        },
        error: () => {
          this.errorMessage.set(this.failureLit());
          this.busy.set(false);
        }
      });
  }
}
