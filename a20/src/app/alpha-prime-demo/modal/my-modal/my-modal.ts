import {Component, inject, OnInit, signal} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {AlphaPrimeDebugTagComponent} from 'AlphaPrime';
import {MyForm} from '../my-form/my-form';

@Component({
  selector: 'app-my-modal',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    MyForm
  ],
  templateUrl: './my-modal.html',
  styleUrl: './my-modal.scss',
})
export class MyModal implements OnInit {

  // INJECTION
  private readonly mDdc = inject(DynamicDialogConfig);
  private readonly mDdr = inject(DynamicDialogRef);

  // VIEW MODEL
  protected readonly ready = signal(false);

  // PRIVATES
  private onClose: (summary: string) => any = () => {};

  ngOnInit() {
    this.mDdc.data.setInstance(this);
    setTimeout(() => {
      this.mDdc.header='My Modal';
    }, 10);
  }

  // API
  init(
    onClose: (summary: string) => any): void {
    this.onClose = onClose;
    this.ready.set(true);
  }

  // VIEW EVENTS
  protected onCancelled(): void {
    this.mDdr.destroy();
  }

  protected onDone(summary: string): void {
    this.onClose(summary);
    this.mDdr.close(summary);
  }
}
