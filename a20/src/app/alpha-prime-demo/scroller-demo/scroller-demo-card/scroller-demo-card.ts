import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {IScrollerDemoCardData} from '../scroller-demo-model';
import {
  AlphaPrimeDebugTagComponent
} from '../../../../../projects/alpha-prime/src/lib/components/alpha-prime-debug-tag/alpha-prime-debug-tag.component';

@Component({
  selector: 'app-scroller-demo-card',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent
  ],
  templateUrl: './scroller-demo-card.html',
  styleUrl: './scroller-demo-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollerDemoCard {
  item =
    input<IScrollerDemoCardData | undefined>(undefined);
  selected = input(false);
  clicked = output<IScrollerDemoCardData>();

  onClick(): void {
    if (this.item()) {
      this.clicked.emit(this.item()!);
    }
  }

}
