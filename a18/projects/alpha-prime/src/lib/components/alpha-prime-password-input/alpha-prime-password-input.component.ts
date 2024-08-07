import {Component, EventEmitter, Input, Output} from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {AlphaPrimeService} from "../../services/alpha-prime.service";

@Component({
  selector: 'alpha-prime-password-input',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    ButtonModule,
    RippleModule
  ],
  templateUrl: './alpha-prime-password-input.component.html',
  styleUrl: './alpha-prime-password-input.component.css'
})
export class AlphaPrimePasswordInputComponent {
  inputType: 'password' | 'text' = 'password';
  @Input() name = '';
  @Input() disabled = false;
  @Input() password: string | undefined;
  @Output() passwordChange = new EventEmitter<string>();

  constructor(
    ps: AlphaPrimeService) {
    this.name = ps.generateRandomName();
  }

  get empty(): boolean {
    return this.password === undefined
      || this.password === '';
  }

  onShowHide() {
    this.inputType = this.inputType === 'password'
      ? 'text' : 'password';
  }

  onPasswordChanged(password: string) {
    this.password = password;
    this.passwordChange.emit(password);
  }

}
