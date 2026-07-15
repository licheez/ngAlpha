import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
  viewChild,
  ElementRef,
  AfterViewInit,
  computed,
  input,
  inject,
  OnDestroy
} from '@angular/core';
import { AlphaPrimeService } from '../../services/alpha-prime.service';

export interface VirtualRow<T> {
  index: number;
  data: T;
}

export type AlphaPrimeScrollerPredicate<T> = (
  item: T,
  index: number,
  items: readonly T[]
) => boolean;

@Component({
  selector: 'alpha-prime-scroller',
  standalone: true,
  templateUrl: './alpha-prime-scroller.component.html',
  styleUrl: './alpha-prime-scroller.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlphaPrimeScrollerComponent<T = unknown> implements AfterViewInit, OnDestroy {
  private readonly alphaPrimeService = inject(AlphaPrimeService);
  private resizeObserver?: ResizeObserver;

  // Inputs
  loadMoreThreshold = input(200); // pixels from bottom to trigger load
  itemHeight = input(150); // estimated height per item
  bufferSize = input(10); // extra items to render above/below viewport
  showLoadingIndicator = input(true); // show spinner when loading
  loadingMessage = input<string | undefined>(undefined); // custom loading message

  // Computed loading text
  effectiveLoadingMessage = computed(() => {
    const custom = this.loadingMessage();
    return custom ?? this.alphaPrimeService.getTr('alpha.scroller.loading');
  });

  // Outputs
  loadMore = output<number>(); // Emits current item count
  scrolled = output<number>();

  // Internal state
  private scrollContainer =
    viewChild<ElementRef<HTMLDivElement>>('scrollContainer');
  private allItems = signal<T[]>([]);
  private isNearBottom = signal(false);

  loading = signal(false);

  // Virtual scrolling calculations
  private scrollTop = signal(0);
  private containerHeight = signal(600);

  // Computed visible range
  private visibleStartIndex = computed(() => {
    const start = Math.floor(this.scrollTop() / this.itemHeight());
    return Math.max(0, start - this.bufferSize());
  });

  private visibleEndIndex = computed(() => {
    const itemsInView = Math.ceil(this.containerHeight() / this.itemHeight());
    const end = Math.floor(this.scrollTop() / this.itemHeight()) + itemsInView;
    return Math.min(this.allItems().length, end + this.bufferSize());
  });

  // Visible rows for template
  visibleRows = computed<VirtualRow<T>[]>(() => {
    const items = this.allItems();
    const start = this.visibleStartIndex();
    const end = this.visibleEndIndex();

    const rows: VirtualRow<T>[] = [];
    for (let i = start; i < end; i++) {
      rows.push({
        index: i,
        data: items[i]
      });
    }
    return rows;
  });

  // Padding calculations
  paddingTop = computed(() => this.visibleStartIndex() * this.itemHeight());
  paddingBottom = computed(() => {
    const remaining = this.allItems().length - this.visibleEndIndex();
    return Math.max(0, remaining * this.itemHeight());
  });

  ngAfterViewInit() {
    // Get initial container height
    const container = this.scrollContainer()?.nativeElement;
    if (container) {
      this.containerHeight.set(container.clientHeight);

      // Observe size changes (e.g., from RemainingHeight directive)
      this.resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const newHeight = entry.contentRect.height;
          if (newHeight > 0) {
            this.containerHeight.set(newHeight);
          }
        }
      });
      this.resizeObserver.observe(container);
    }

    // Initial check after a small delay
    setTimeout(() => this.checkScroll(), 100);
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  // Appends newly loaded page items at the bottom.
  addItems(newItems: readonly T[]) {
    if (newItems.length === 0) return;
    this.allItems.update(current => [...current, ...newItems]);
  }

  // Replaces the current list with a new sequence.
  resetItems(items: readonly T[] = []) {
    this.allItems.set([...items]);
    this.isNearBottom.set(false);
    this.syncScrollSignals();
  }

  // Inserts one or more items at the top and keeps viewport anchored.
  insertAtTop(itemOrItems: T | readonly T[]) {
    const items = Array.isArray(itemOrItems) ? itemOrItems : [itemOrItems];
    if (items.length === 0) return;

    this.allItems.update(current => [...items, ...current]);
    this.shiftScrollTop(items.length);
  }


  replaceAt(index: number, item: T): boolean {
    const items = this.allItems();
    if (index < 0 || index >= items.length) {
      return false;
    }

    const next = [...items];
    next[index] = item;
    this.allItems.set(next);
    return true;
  }

  findIndex(predicate: AlphaPrimeScrollerPredicate<T>): number {
    const items = this.allItems();
    for (let i = 0; i < items.length; i++) {
      if (predicate(items[i], i, items)) {
        return i;
      }
    }
    return -1;
  }

  find(predicate: AlphaPrimeScrollerPredicate<T>): T | undefined {
    const index = this.findIndex(predicate);
    if (index < 0) {
      return undefined;
    }
    return this.allItems()[index];
  }

  itemCount(): number {
    return this.allItems().length;
  }


  onScroll() {
    this.checkScroll();
  }

  private checkScroll() {
    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;

    // Update scroll position
    this.scrollTop.set(scrollTop);

    // Emit scroll position
    this.scrolled.emit(scrollTop);

    // Check if near bottom
    const nearBottom = scrollBottom <= this.loadMoreThreshold();

    if (nearBottom && !this.loading() && !this.isNearBottom()) {
      this.isNearBottom.set(true);
      this.loadMore.emit(this.allItems().length);
    } else if (!nearBottom) {
      this.isNearBottom.set(false);
    }
  }

  private shiftScrollTop(addedItemsCount: number) {
    if (addedItemsCount <= 0) return;

    const container = this.scrollContainer()?.nativeElement;
    if (!container) {
      return;
    }

    const offset = addedItemsCount * this.itemHeight();
    container.scrollTop += offset;
    this.scrollTop.set(container.scrollTop);
  }

  private syncScrollSignals() {
    const container = this.scrollContainer()?.nativeElement;
    if (!container) {
      this.scrollTop.set(0);
      return;
    }

    this.scrollTop.set(container.scrollTop);
  }
}

