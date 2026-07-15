import {Component, computed, model, output} from '@angular/core';
import {AlphaPrimeCancelButtonComponent, AlphaPrimeDebugTagComponent, AlphaPrimeSaveButtonComponent} from 'AlphaPrime';
import {Textarea} from 'primeng/textarea';
import {AlphaUtils} from 'AlphaCommon';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-my-form',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    Textarea,
    AlphaPrimeCancelButtonComponent,
    AlphaPrimeSaveButtonComponent,
    FormsModule
  ],
  templateUrl: './my-form.html',
  styleUrl: './my-form.scss',
})
export class MyForm {

  // API
  readonly cancelled = output();
  readonly done = output<string>();

  // VIEW MODEL
  protected readonly summary = model<string>('');
  protected readonly invalid = computed(() =>
    AlphaUtils.eon(this.summary()));

  // VIEW EVENTS
  protected onCancel(): void {
    this.cancelled.emit();
  }

  protected onSave(): void {
    this.done.emit(this.summary()!);
  }
}
