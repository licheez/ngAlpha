import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { AlphaPrimeAutoCompleteComponent } from '../../../projects/alpha-prime/src/lib/components/alpha-prime-auto-complete/alpha-prime-auto-complete.component';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-alpha-prime-auto-complete-demo',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime - AutoComplete Demo</h2>

      <lib-alpha-prime-auto-complete
        [feeder]="feeder"
        (selected)="onSelected($event)"
        [placeHolder]="'Type to search'"
      ></lib-alpha-prime-auto-complete>

      <p *ngIf="selectedItem()">Selected: {{ selectedItem()?.caption }}</p>
    </section>
  `,
  imports: [CommonModule, AlphaPrimeAutoCompleteComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlphaPrimeAutoCompleteDemoComponent {
  protected readonly selectedItem = signal<any | null>(null);

  feeder = (term: string): Observable<any[]> => {
    const items = [
      { id: 1, caption: 'Apple' },
      { id: 2, caption: 'Banana' },
      { id: 3, caption: 'Cherry' },
      { id: 4, caption: 'Date' },
      { id: 5, caption: 'Elderberry' }
    ];
    const filtered = items.filter(i => i.caption.toLowerCase().includes(term.toLowerCase()));
    return of(filtered);
  }

  onSelected(item: any): void {
    this.selectedItem.set(item);
  }
}
