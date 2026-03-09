import { ChangeDetectionStrategy, Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { CssScrollerDemoService, ICssScrollerDemoItem } from '../css-scroller-demo.service';
import { AlphaPrimeCssScroller } from '../../../../../projects/alpha-prime/src/lib/components/alpha-prime-css-scroller/alpha-prime-css-scroller';
import { CssScrollerCard } from '../css-scroller-card/css-scroller-card';

@Component({
  selector: 'app-css-scroller-demo-list',
  imports: [
    AlphaPrimeCssScroller,
    CssScrollerCard
  ],
  templateUrl: './css-scroller-demo-list.component.html',
  styleUrl: './css-scroller-demo-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CssScrollerDemoList implements OnInit {
  private readonly svc = inject(CssScrollerDemoService);

  // Reference to the scroller component
  scroller = viewChild<AlphaPrimeCssScroller<ICssScrollerDemoItem>>('scroller');

  // Only track items locally for display purposes (selected item, count, etc.)
  items = signal<ICssScrollerDemoItem[]>([]);
  selectedItem = signal<ICssScrollerDemoItem | undefined>(undefined);

  private pageSize = 20;
  private hasMore = true;

  ngOnInit(): void {
    // Load first page
    setTimeout(() => this.loadMore(0), 100);
  }

  onLoadMore(currentCount: number) {
    if (!this.hasMore) return;
    this.loadMore(currentCount);
  }

  private loadMore(skip: number) {
    console.log(`Loading more items from ${skip}`);

    const scrollerInstance = this.scroller();
    if (scrollerInstance) {
      scrollerInstance.loading.set(true);
    }

    this.svc.list(skip, this.pageSize).subscribe({
      next: (newItems) => {
        console.log(`Loaded ${newItems.length} items`);

        if (newItems.length === 0) {
          this.hasMore = false;
        }

        // Add items to scroller (it manages the list internally)
        scrollerInstance?.addItems(newItems);

        // Also track locally for display
        const allItems = [...this.items(), ...newItems];
        this.items.set(allItems);

        if (scrollerInstance) {
          scrollerInstance.loading.set(false);
        }
      },
      error: (err) => {
        console.error('Error loading items:', err);
        if (scrollerInstance) {
          scrollerInstance.loading.set(false);
        }
      }
    });
  }

  onSelectItem(item: ICssScrollerDemoItem) {
    console.log('Selected:', item.title);
    this.selectedItem.set(item);
  }
}

