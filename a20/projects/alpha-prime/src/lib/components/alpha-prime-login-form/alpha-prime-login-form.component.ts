import {ChangeDetectionStrategy, Component, inject, output, signal} from '@angular/core';
import {AlphaPrimeService} from '../../services/alpha-prime.service';
import {AlphaPrimeDebugTagComponent} from '../alpha-prime-debug-tag/alpha-prime-debug-tag.component';
import {AlphaPrimeLabelComponent} from '../alpha-prime-label/alpha-prime-label.component';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';


class FormModel {
  username = '';
  password = '';

  eon(value: string | undefined): boolean {
    return value === undefined
      || value.trim() === '';
  }

  get invalid(): boolean {
    return this.eon(this.username)
      || this.eon(this.password);
  }
}

@Component({
  selector: 'alpha-prime-login-form',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    AlphaPrimeLabelComponent,
    InputText,
    FormsModule
  ],
  templateUrl: './alpha-prime-login-form.component.html',
  styleUrl: './alpha-prime-login-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlphaPrimeLoginFormComponent {

  private readonly mPs = inject(AlphaPrimeService);

  showCancelButton = signal(false);
  fm: FormModel = new FormModel();
  busy = signal(false);
  errorMessage = signal<string | undefined>(undefined);

  loggedIn = output();
  cancelled = output();

  usernameLit = this.mPs.getTr('alpha.common.username');
  passwordLit = this.mPs.getTr('alpha.common.password');
  failureLit = this.mPs.getTr('alpha.common.failure');
  invalidCredentialsLit = this.mPs.getTr('alpha.common.invalidCredentials');
  connectLabelLit = this.mPs.getTr('alpha.loginForm.connect');

  onCancel() {
    this.cancelled.emit();
  }
  onSubmit() {
    this.busy.set(true);
    this.errorMessage.set(undefined);
    this.mPs.signIn(
      this.fm.username, this.fm.password, true)
      .subscribe({
        next: ok => {
          if (ok) {
            this.loggedIn.emit();
          } else {
            this.errorMessage.set(this.invalidCredentialsLit);
          }
          this.busy.set(false);
        },
        error: () => {
          this.errorMessage.set(this.failureLit);
          this.busy.set(false);
        }
      });
  }
}
