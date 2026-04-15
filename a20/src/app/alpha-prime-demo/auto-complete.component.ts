import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { AlphaPrimeAutoCompleteComponent } from '../../../projects/alpha-prime/src/lib/components/alpha-prime-auto-complete/alpha-prime-auto-complete.component';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import {
  IAlphaPrimeAutoCompleteEntry
} from '../../../projects/alpha-prime/src/lib/components/alpha-prime-auto-complete/alpha-prime-auto-complete';

@Component({
  selector: 'app-alpha-prime-auto-complete-demo',
  standalone: true,
  template: `
    <h2>Alpha Prime - AutoComplete Demo</h2>

    <alpha-prime-auto-complete
      [feeder]="feeder"
      [showAdd]="true"
      (selected)="onSelected($event)"
      (cleared)="onCleared()"
      [placeHolder]="'Type to search'"
      [timeout]="50"
    ></alpha-prime-auto-complete>

    @if (selectedItem()) {
      <p>Selected: {{ selectedItem()?.caption }}</p>
    }
  `,
  imports: [CommonModule, AlphaPrimeAutoCompleteComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlphaPrimeAutoCompleteDemoComponent {

  protected readonly selectedItem =
    signal<IAlphaPrimeAutoCompleteEntry | null>(null);

  private items: IAlphaPrimeAutoCompleteEntry[] = [
    { id: '1', caption: 'Apple' },
    { id: '2', caption: 'Banana' },
    { id: '3', caption: 'Cherry' },
    { id: '4', caption: 'Date' },
    { id: '5', caption: 'Elderberry' }
  ];

  feeder = (term: string): Observable<IAlphaPrimeAutoCompleteEntry[]> => {
    if (term == '%') return of(this.items);
    const filtered =
      this.items.filter(i =>
        i.caption.toLowerCase().includes(term.toLowerCase()));
    return of(filtered);
  }

  onSelected(item: IAlphaPrimeAutoCompleteEntry): void {
    this.selectedItem.set(item);
  }

  onCleared(): void {
    this.selectedItem.set(null);
  }
}
