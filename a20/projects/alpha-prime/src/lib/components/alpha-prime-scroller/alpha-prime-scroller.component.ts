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
  inject
} from '@angular/core';
import { AlphaPrimeService } from '../../services/alpha-prime.service';

export interface VirtualRow<T> {
  index: number;
  data: T;
}

@Component({
  selector: 'alpha-prime-scroller',
  standalone: true,
  templateUrl: './alpha-prime-scroller.component.html',
  styleUrl: './alpha-prime-scroller.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlphaPrimeScrollerComponent<T = any> implements AfterViewInit {
  private readonly alphaPrimeService = inject(AlphaPrimeService);

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
      if (items[i]) {
        rows.push({
          index: i,
          data: items[i]
        });
      }
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
    }

    // Initial check after a small delay
    setTimeout(() => this.checkScroll(), 100);
  }

  // Public method to add items
  addItems(newItems: T[]) {
    const current = this.allItems();
    this.allItems.set([...current, ...newItems]);
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
}

