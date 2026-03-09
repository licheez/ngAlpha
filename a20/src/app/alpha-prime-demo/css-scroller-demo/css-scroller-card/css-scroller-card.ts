import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ICssScrollerDemoItem } from '../css-scroller-demo.service';

@Component({
  selector: 'app-css-scroller-card',
  template: `
    @if(item()) {
      <div class="card"
           [class.selected]="selected()"
           (click)="clicked.emit(item()!)">
        <h5 class="card-title">{{item()!.title}}</h5>
        <p class="card-text">{{item()!.description}}</p>
      </div>
    }
  `,
  styles: [`
    .card {
      background-color: #ffffff;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-color: #adb5bd;
      }

      &.selected {
        border-color: #007bff;
        border-width: 2px;
        background-color: #e7f3ff;
      }
    }

    .card-title {
      color: #212529;
      font-weight: 600;
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }

    .card-text {
      color: #212529;
      font-size: 0.95rem;
      line-height: 1.6;
      margin: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CssScrollerCard {
  item = input<ICssScrollerDemoItem>();
  selected = input(false);
  clicked = output<ICssScrollerDemoItem>();
}

