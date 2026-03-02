import {Component, inject, OnInit, signal} from '@angular/core';
import {AlphaPrimeService} from '../../services/alpha-prime.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {AlphaPrimeDebugTagComponent} from '../alpha-prime-debug-tag/alpha-prime-debug-tag.component';
import {AlphaPrimeLoginFormComponent} from '../alpha-prime-login-form/alpha-prime-login-form.component';

@Component({
  selector: 'alpha-prime-login-modal',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    AlphaPrimeLoginFormComponent
  ],
  templateUrl: './alpha-prime-login-modal.component.html',
  styleUrl: './alpha-prime-login-modal.component.css'
})
export class AlphaPrimeLoginModalComponent implements OnInit {

  private readonly mPs = inject(AlphaPrimeService);
  private readonly mDdr = inject(DynamicDialogRef);
  private readonly mDdc = inject(DynamicDialogConfig);

  ready = signal(false);
  onClose: (loggedIn: boolean) => any = () => {};

  usernameLabel?: string;
  passwordLabel?: string;
  failureMessage?: string;
  invalidCredentialsMessage?: string;
  connectLabel?: string;
  showCancelButton = false;

  ngOnInit():void {
    this.mDdc.data.setInstance(this);

    setTimeout(
      () => this.mDdc.header =
        this.mDdc.header ||
        this.mPs.getTr('alpha.loginModal.title'),
      100);
  }

  init(
    onClose: (loggedIn: boolean) => any,
    usernameLabel?: string,
    passwordLabel?: string,
    connectLabel?: string,
    failureMessage?: string,
    invalidCredentialsMessage?: string,
    showCancelButton = false): void {
    this.onClose = onClose;
    this.ready.set(true);
    this.usernameLabel = usernameLabel;
    this.passwordLabel = passwordLabel;
    this.failureMessage = failureMessage;
    this.invalidCredentialsMessage = invalidCredentialsMessage;
    this.connectLabel = connectLabel;
    this.showCancelButton = showCancelButton;
  }

  onLoggedIn(): void {
    this.onClose(true);
    this.mDdr.close(true);
  }

  onCancelled(): void {
    this.onClose(false);
    this.mDdr.destroy();
  }

}
