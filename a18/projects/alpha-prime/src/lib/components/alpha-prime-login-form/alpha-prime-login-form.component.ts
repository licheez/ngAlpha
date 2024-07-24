import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {AlphaPrimeDebugTagComponent} from "../alpha-prime-debug-tag/alpha-prime-debug-tag.component";
import {NgIf} from "@angular/common";
import {AlphaPrimeLabelComponent} from "../alpha-prime-label/alpha-prime-label.component";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {AlphaPrimePasswordInputComponent} from "../alpha-prime-password-input/alpha-prime-password-input.component";
import {AlphaPrimeProgressBarComponent} from "../alpha-prime-progress-bar/alpha-prime-progress-bar.component";
import {AlphaPrimeCancelButtonComponent} from "../alpha-prime-cancel-button/alpha-prime-cancel-button.component";
import {ButtonModule} from "primeng/button";

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
    NgIf,
    AlphaPrimeLabelComponent,
    InputTextModule,
    FormsModule,
    AlphaPrimePasswordInputComponent,
    AlphaPrimeProgressBarComponent,
    AlphaPrimeCancelButtonComponent,
    ButtonModule
  ],
  templateUrl: './alpha-prime-login-form.component.html',
  styleUrl: './alpha-prime-login-form.component.css'
})
export class AlphaPrimeLoginFormComponent {

  @Input() showCancelButton = false;

  fm: FormModel = new FormModel();
  busy = false;
  errorMessage: string | undefined;

  @Output() loggedIn = new EventEmitter();
  @Output() cancelled = new EventEmitter();

  usernameLit = '';
  passwordLit = '';
  failureLit = '';
  invalidCredentialsLit = '';
  connectLabelLit = '';

  constructor(
    private mPs: AlphaPrimeService) {
    this.usernameLit = mPs.getTr('alpha.common.username');
    this.passwordLit = mPs.getTr('alpha.common.password');
    this.failureLit = mPs.getTr('alpha.common.failure');
    this.invalidCredentialsLit = mPs.getTr('alpha.common.invalidCredentials');
    this.connectLabelLit = mPs.getTr('alpha.loginForm.connect');
  }

  onCancel() {
    this.cancelled.emit();
  }

  onSubmit() {
    this.busy = true;
    this.errorMessage = undefined;
    this.mPs.signIn(
      this.fm.username, this.fm.password, true)
      .subscribe({
        next: ok => {
          if (ok) {
            this.loggedIn.emit();
          } else {
            this.errorMessage = this.invalidCredentialsLit;
          }
          this.busy = false;
        },
        error: () => {
          this.errorMessage = this.failureLit;
          this.busy = false;
        }
      });
  }

}
