# AlphaPrime Scroller

`alpha-prime-scroller` is a virtualized list container with explicit list management methods.

## State Ownership Model

The component owns its internal list. Callers do not mutate the list directly.

This keeps virtual-scroll calculations (`visibleRows`, `paddingTop`, `paddingBottom`) consistent while still allowing all common list operations.

## Public List API

- `addItems(newItems: readonly T[])`: append newly loaded page items.
- `resetItems(items: readonly T[] = [])`: replace the full loaded list.
- `insertAtTop(itemOrItems: T | readonly T[])`: insert one or many items at index `0` and keep viewport anchored.
- `replaceAt(index: number, item: T): boolean`: replace item at index.
- `findIndex(predicate): number`: find by lambda and return index or `-1`.
- `find(predicate): T | undefined`: find by lambda and return item.
- `itemCount(): number`: total loaded list length.

When passing an array to `insertAtTop`, input order is preserved.

## API Migration Notes

Removed methods and replacements:

- `appendItems(items)` -> `addItems(items)`
- `prependItems(items)` -> `insertAtTop(items)`
- `insertAtBottom(item)` -> not supported (ambiguous with lazy paging)
- `insertAt(index, item)` -> not supported

The predicate signature is:

```ts
(item: T, index: number, items: readonly T[]) => boolean
```

## Usage Example

```ts
import { Component, viewChild } from '@angular/core';
import { AlphaPrimeScrollerComponent } from '@pvway/alpha-prime';

interface UserRow {
  id: string;
  name: string;
}

@Component({
  selector: 'app-scroller-host',
  template: `
    <alpha-prime-scroller #scroller [itemHeight]="72" />
    <button type="button" (click)="reload()">Reload</button>
  `
})
export class ScrollerHostComponent {
  private readonly scroller = viewChild<AlphaPrimeScrollerComponent<UserRow>>('scroller');

  reload(): void {
    this.scroller()?.resetItems([]);
    this.scroller()?.addItems([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' }
    ]);
  }

  prependRealtime(row: UserRow): void {
    this.scroller()?.insertAtTop(row);
  }

  prependRealtimeBatch(rows: UserRow[]): void {
    this.scroller()?.insertAtTop(rows);
  }

  updateRow(id: string, next: UserRow): void {
    const index = this.scroller()?.findIndex(item => item.id === id) ?? -1;
    if (index >= 0) {
      this.scroller()?.replaceAt(index, next);
    }
  }
}
```

