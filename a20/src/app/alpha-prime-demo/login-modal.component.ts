import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Button} from 'primeng/button';
import {AlphaPrimeModalService} from '../../../projects/alpha-prime/src/lib/services/alpha-prime-modal.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime - LoginModal Demo</h2>
      <p-button label="Open Login Modal"
                (click)="onClicked()"></p-button>
    </section>
  `,
  imports: [
    Button
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginModalComponent {

  constructor(
    private mMs: AlphaPrimeModalService) {
  }

  onClicked(): void {
    this.mMs.openLoginModal(
      'login-modal-demo',
      'Login Modal Demo',
      "username", "password", "Connect",
      "Login failed. Please try again.",
      "Invalid credentials. Please check your username and password.",
      true).subscribe(loggedIn => {
      if (loggedIn) {
        alert('User logged in successfully!');
      } else {
        alert('Login was cancelled');
      }
    });
  }
}
