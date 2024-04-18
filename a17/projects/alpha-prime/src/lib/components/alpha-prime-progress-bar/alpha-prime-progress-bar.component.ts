import {Component, Input} from '@angular/core';
import {ProgressBarModule} from "primeng/progressbar";
import {NgIf} from "@angular/common";

@Component({
  selector: 'alpha-prime-progress-bar',
  standalone: true,
  imports: [
    ProgressBarModule,
    NgIf
  ],
  templateUrl: './alpha-prime-progress-bar.component.html',
  styleUrl: './alpha-prime-progress-bar.component.css'
})
export class AlphaPrimeProgressBarComponent {

  @Input() busy = false;
  @Input() value = 100;
  @Input() mode: 'determinate' | 'indeterminate' | 'tiny' = 'indeterminate';

}
