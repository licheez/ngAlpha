import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {AlphaPrimeDebugTagComponent} from "../alpha-prime-debug-tag/alpha-prime-debug-tag.component";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {NgIf} from "@angular/common";

@Component({
  selector: 'alpha-prime-filter-box',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    InputTextModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    NgIf
  ],
  templateUrl: './alpha-prime-filter-box.component.html',
  styleUrls: ['./alpha-prime-filter-box.component.css']
})
export class AlphaPrimeFilterBoxComponent {

  @Input() delay = 300;
  @Input() showAdd = false;
  @Input() term: string | undefined;
  @Input() disabled = false;
  @Input() placeholder = '';

  @Output() termChange = new EventEmitter<string | undefined>();
  @Output() addClicked = new EventEmitter<string | undefined>();

  constructor(
    private mPs: AlphaPrimeService) { }

  get empty(): boolean {
    return !this.term;
  }

  timer: any;

  name = this.mPs.generateRandomName();

  private changeTerm(term: string) {
    this.term = term;
    this.timer = setTimeout(
      () => {
        this.termChange.emit(term);
      }, this.delay);
  }

  onTermChanged(term: string) {
    this.stopTimerIfSet();
    this.changeTerm(term);
  }

  onClear() {
    this.stopTimerIfSet();
    this.term = undefined;
    this.termChange.emit(undefined);
  }

  onAddClicked() {
    this.stopTimerIfSet();
    this.addClicked.emit(this.term);
  }

  private stopTimerIfSet(){
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

}
