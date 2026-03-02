import {ChangeDetectionStrategy, Component, effect, inject, signal} from '@angular/core';
import {FakeOasService} from './fake-oas-service';
import {AlphaPrimeLoginFormComponent} from '../../../projects/alpha-prime/src/lib/components/alpha-prime-login-form/alpha-prime-login-form.component';
import {FormsModule} from '@angular/forms';
import {ToggleSwitch} from 'primeng/toggleswitch';

@Component({
  selector: 'app-login-form',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime - Login Form Demo</h2>

      <form novalidate autocomplete="off"
            class="p-fluid p-formgrid grid">

        <!-- Control to toggle success/failure -->
        <div class="p-field col-12">
          <label for="success-toggle" class="mr-3">Mock Sign In Success</label>
          <p-toggleswitch id="success-toggle"
                         [(ngModel)]="mockSuccess"
                         [ngModelOptions]="{standalone: true}"
                         [disabled]="false"></p-toggleswitch>
          <p class="text-sm text-gray-600 mt-2">
            Toggle to control whether the mock sign in will succeed or fail
          </p>
        </div>

        <div class="p-field col-12">
          <label for="throw-error-toggle" class="mr-3">Mock Sign In ThrowError</label>
          <p-toggleswitch id="throw-error-toggle"
                          [(ngModel)]="throwError"
                          [ngModelOptions]="{standalone: true}"
                          [disabled]="false"></p-toggleswitch>
          <p class="text-sm text-gray-600 mt-2">
            Toggle to control whether the mock sign in will throw an error
          </p>
        </div>


        <!-- Status Display -->
        <div class="p-field col-12">
          <h3>Status</h3>
          <ul>
            <li>Mock Success: <strong>{{ mockSuccess() }}</strong></li>
            <li>Mock ThrowError: <strong>{{ throwError() }}</strong></li>
            <li>Logged In: <strong>{{ loggedIn() }}</strong></li>
            <li>Cancelled: <strong>{{ cancelled() }}</strong></li>
          </ul>
        </div>

        <!-- Login Form Component -->
        <div class="p-field col-12">
          <h3>Login Form Component</h3>
          <alpha-prime-login-form
            [showCancelButton]="true"
            [usernameLabel]="'Username or Email'"
            [passwordLabel]="'Password'"
            [connectLabel]="'Sign In'"
            [failureMessage]="'Something went wrong. Please try again.'"
            [invalidCredentialsMessage]="'Invalid username or password. Please check your credentials.'"
            (loggedIn)="onLoggedIn()"
            (cancelled)="onCancelled()"></alpha-prime-login-form>
        </div>

      </form>

    </section>
  `,
  styles: [`
    h2 {
      margin-bottom: 2rem;
    }

    h3 {
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      padding: 0.5rem 0;
      font-size: 0.95rem;
    }

    .text-sm {
      font-size: 0.875rem;
    }

    .text-gray-600 {
      color: #4b5563;
    }

    .mt-2 {
      margin-top: 0.5rem;
    }

    .mr-3 {
      margin-right: 0.75rem;
    }
  `],
  imports: [
    AlphaPrimeLoginFormComponent,
    FormsModule,
    ToggleSwitch
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {
  private readonly mOas: FakeOasService = inject(FakeOasService);

  // Signal to control mock behavior
  mockSuccess = signal(true);
  throwError = signal(false);

  // Signals to track component state
  loggedIn = signal(false);
  cancelled = signal(false);

  constructor() {
    // Update FakeOasService based on mockSuccess signal changes
    effect(() => {
      console.log("Mock Success changed to:", this.mockSuccess());
      this.mOas.success = this.mockSuccess();
    });
    effect(() => {
      console.log("Mock ThrowError changed to:", this.throwError());
      this.mOas.throwError = this.throwError();
    });
  }

  onLoggedIn(): void {
    this.loggedIn.set(true);
    this.cancelled.set(false);
    console.log('User logged in successfully');
  }

  onCancelled(): void {
    this.cancelled.set(true);
    this.loggedIn.set(false);
    console.log('Login form cancelled');
  }
}
