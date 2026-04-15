import {AlphaPrimeProgressBarComponent}
  from '../../../projects/alpha-prime/src/lib/components/alpha-prime-progress-bar/alpha-prime-progress-bar.component';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal} from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <h2>Alpha Prime - Progress Bar Demo</h2>
      <h3>{{ value() }}</h3>
      <p>
        <alpha-prime-progress-bar
          [busy]="true"
          [color]="'blue'"
        ></alpha-prime-progress-bar>
        </p>
      <p>
        <alpha-prime-progress-bar
          [busy]="true"
          [color]="'green'"
          [mode]= "'determinate'"
          [value]="value()"
        ></alpha-prime-progress-bar>
      </p>
      <p>
        <alpha-prime-progress-bar
          [busy]="true"
          [color]="'yellow'"
          [mode]="'tiny'"
          [value]="value()"
        ></alpha-prime-progress-bar>
      </p>
    </section>
  `,
  imports: [
    AlphaPrimeProgressBarComponent
  ]
})
export class ProgressBarComponent implements OnInit, OnDestroy {

  value = signal<number>(0);
  private intervalId: any;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.value.update(v => {
        const newValue = v + 10;
        return newValue > 100 ? 0 : newValue;
      });
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

}
