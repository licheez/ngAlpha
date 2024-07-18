import { Component } from '@angular/core';
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {AlphaPrimeDebugTagComponent} from "../alpha-prime-debug-tag/alpha-prime-debug-tag.component";
import {AlphaPrimeLoginFormComponent} from "../alpha-prime-login-form/alpha-prime-login-form.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'alpha-prime-login-modal',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    AlphaPrimeLoginFormComponent,
    NgIf
  ],
  templateUrl: './alpha-prime-login-modal.component.html',
  styleUrl: './alpha-prime-login-modal.component.css'
})
export class AlphaPrimeLoginModalComponent {
  ready = false;
  onClose: (loggedIn: boolean) => any = () => {};

  constructor(
    private mPs: AlphaPrimeService,
    private mDdr: DynamicDialogRef,
    private mDdc: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.mDdc.data.setInstance(this);

    setTimeout(
      () => this.mDdc.header =
        this.mPs.getTr('alpha.loginModal.title'),
      100);
  }

  init(
    onClose: (loggedIn: boolean) => any) {
    this.onClose = onClose;
    this.ready = true;
  }

  onLoggedIn() {
    this.onClose(true);
    this.mDdr.close(true);
  }

  onCancelled() {
    this.onClose(false);
    this.mDdr.destroy();
  }

}
