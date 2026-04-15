import {Component, computed, input, model, OnDestroy, output} from '@angular/core';
import {AlphaPrimeService} from '../../services/alpha-prime.service';
import {AlphaPrimeDebugTagComponent} from '../alpha-prime-debug-tag/alpha-prime-debug-tag.component';
import {InputGroup} from 'primeng/inputgroup';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'alpha-prime-filter-box',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    InputGroup,
    FormsModule,
    InputText,
    Button,
    Ripple
  ],
  templateUrl: './alpha-prime-filter-box.component.html',
  styleUrl: './alpha-prime-filter-box.component.css'
})
export class AlphaPrimeFilterBoxComponent implements OnDestroy {

  delay = input<number>(300);
  showAdd = input<boolean>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');

  term = model<string | undefined>(undefined);

  empty = computed(() => {
    const currentTerm = this.term();
    return !currentTerm || currentTerm.trim() === '';
  });

  addClicked = output<string | undefined>();

  name: string;
  timer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    ps: AlphaPrimeService) {
    this.name = ps.generateRandomName();
  }

  ngOnDestroy(): void {
    this.stopTimerIfSet();
  }

  private changeTerm(newTerm: string) {
    this.timer = setTimeout(
      () => {
        this.term.set(newTerm);
      }, this.delay());
  }

  onTermChanged(newTerm: string) {
    this.stopTimerIfSet();
    this.changeTerm(newTerm);
  }

  onClear() {
    this.stopTimerIfSet();
    this.term.set(undefined);
  }

  onAddClicked() {
    this.stopTimerIfSet();
    this.addClicked.emit(this.term());
  }

  private stopTimerIfSet() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

  }

}
