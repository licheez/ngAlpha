import {Component, EventEmitter, Output} from '@angular/core';
import {AlphaPrimeDebugTagComponent, AlphaPrimeOkButtonComponent} from "@pvway/alpha-prime";
import {RatingModule} from "primeng/rating";
import {FormsModule} from "@angular/forms";
import {DividerModule} from "primeng/divider";

@Component({
  selector: 'app-ps-modals-feedback-form',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    RatingModule,
    FormsModule,
    AlphaPrimeOkButtonComponent,
    DividerModule
  ],
  templateUrl: './ps-modals-feedback-form.component.html',
  styleUrl: './ps-modals-feedback-form.component.scss'
})
export class PsModalsFeedbackFormComponent {

  rate :number | undefined;

  @Output() rated = new EventEmitter<number>();
  @Output() cancelled = new EventEmitter();

  onDone(): void {
    if (this.rate) {
      this.rated.emit(this.rate);
    } else {
      this.cancelled.emit();
    }
  }

}
