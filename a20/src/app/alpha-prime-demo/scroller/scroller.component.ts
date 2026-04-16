import {ChangeDetectionStrategy, Component, OnInit, signal, viewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  AlphaPrimeScrollerComponent
} from '../../../../projects/alpha-prime/src/lib/components/alpha-prime-scroller/alpha-prime-scroller.component';
import {
  AlphaPrimeRemainingHeightDirective
} from '../../../../projects/alpha-prime/src/lib/directives/alpha-prime-remaining-height.directive';

interface DemoItem {
  id: string;
  title: string;
  description: string;
  category: string;
  timestamp: string;
}

@Component({
  selector: 'app-scroller-demo',
  standalone: true,
  imports: [CommonModule, AlphaPrimeScrollerComponent, AlphaPrimeRemainingHeightDirective],
  templateUrl: './scroller.component.html',
  styleUrl: './scroller.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollerComponent implements OnInit {

  // Reference to scroller
  scroller = viewChild<AlphaPrimeScrollerComponent<DemoItem>>('scroller');

  // State signals
  items = signal<DemoItem[]>([]);
  lastScrollPosition = signal(0);
  allItemsFetched = signal(false);
  lastFoundIndex = signal(-1);
  lastFoundId = signal<string | null>(null);

  // Sample data repository
  private allItems: DemoItem[] = [];
  private hasMore = true;
  private nextSourceIndex = 0;
  private readonly pageSize = 20;

  constructor() {
    this.generateSampleData();
  }

  ngOnInit(): void {
    // Load initial page
    setTimeout(() => this.loadMore(), 100);
  }

  /**
   * Handle load more event from scroller
   */
  onLoadMore(currentCount: number): void {
    void currentCount;
    if (!this.hasMore) return;
    this.loadMore();
  }

  /**
   * Load more items from data source
   */
  private loadMore(): void {
    const scrollerInstance = this.scroller();
    if (scrollerInstance) {
      scrollerInstance.loading.set(true);
    }

    // Simulate network delay (increased to show loading indicator)
    setTimeout(() => {
      const start = this.nextSourceIndex;
      const end = start + this.pageSize;
      const newItems = this.allItems.slice(start, end);
      this.nextSourceIndex = end;

      if (newItems.length === 0) {
        this.hasMore = false;
        this.allItemsFetched.set(true);
      }

      // Add to scroller
      scrollerInstance?.addItems(newItems);

      // Track locally
      this.items.set([...this.items(), ...newItems]);

      if (scrollerInstance) {
        scrollerInstance.loading.set(false);
      }
    }, 800);
  }

  resetScroller(): void {
    const scrollerInstance = this.scroller();
    this.hasMore = true;
    this.nextSourceIndex = 0;
    this.allItemsFetched.set(false);
    this.lastFoundIndex.set(-1);
    this.lastFoundId.set(null);
    this.items.set([]);
    scrollerInstance?.resetItems([]);
    this.loadMore();
  }

  clearScroller(): void {
    this.hasMore = false;
    this.nextSourceIndex = 0;
    this.items.set([]);
    this.allItemsFetched.set(true);
    this.lastFoundIndex.set(-1);
    this.lastFoundId.set(null);
    this.scroller()?.resetItems([]);
  }

  insertAtTop(): void {
    const item = this.createRuntimeItem('Top Insert');
    this.scroller()?.insertAtTop(item);
    this.items.update(current => [item, ...current]);
  }

  insertBatchAtTop(): void {
    const items = [
      this.createRuntimeItem('Top Batch 1'),
      this.createRuntimeItem('Top Batch 2')
    ];
    this.scroller()?.insertAtTop(items);
    this.items.update(current => [...items, ...current]);
  }

  findFirstBugFix(): void {
    const scrollerInstance = this.scroller();
    const index = scrollerInstance?.findIndex(item => item.category === 'Bug Fix') ?? -1;
    const found = index >= 0 ? scrollerInstance?.find((_, i) => i === index) : undefined;
    this.lastFoundIndex.set(index);
    this.lastFoundId.set(found?.id ?? null);
  }

  replaceFoundItem(): void {
    const scrollerInstance = this.scroller();
    const index = this.lastFoundIndex();
    if (!scrollerInstance || index < 0) {
      return;
    }

    const current = scrollerInstance.find((_, i) => i === index);
    if (!current) {
      return;
    }

    const replacement: DemoItem = {
      ...current,
      title: `[Replaced] ${current.title}`,
      description: `${current.description}\n\nUpdated via replaceAt(${index}).`,
      timestamp: new Date().toLocaleString()
    };

    const replaced = scrollerInstance.replaceAt(index, replacement);
    if (!replaced) {
      return;
    }

    this.items.update(currentItems => {
      const next = [...currentItems];
      next[index] = replacement;
      return next;
    });
  }

  /**
   * Generate sample data for demonstration
   */
  private generateSampleData(): void {
    const categories = ['News', 'Feature', 'Bug Fix', 'Enhancement', 'Documentation'];
    const now = new Date();

    for (let i = 1; i <= 500; i++) {
      const timestamp = new Date(now.getTime() - i * 60 * 1000);
      this.allItems.push({
        id: `ITEM-${i.toString().padStart(5, '0')}`,
        title: `${this.getRandomCategory(categories)} - Item #${i}`,
        description: this.generateDescription(),
        category: this.getRandomCategory(categories),
        timestamp: timestamp.toLocaleString()
      });
    }
  }

  /**
   * Get random category from list
   */
  private getRandomCategory(categories: string[]): string {
    return categories[Math.floor(Math.random() * categories.length)];
  }

  /**
   * Generate random description text with varying lengths
   */
  private generateDescription(): string {
    const shortDescriptions = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Quick update with minimal details.',
      'Brief note about this item.'
    ];

    const mediumDescriptions = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      'This item contains a moderate amount of information. It provides enough context to understand the main points without being overly verbose. The content is structured to be informative yet concise.',
      'A detailed description that spans multiple lines. It includes important information about the features, benefits, and potential use cases. This helps users make informed decisions.'
    ];

    const longDescriptions = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      'This is a comprehensive description that provides extensive details about the item. It covers multiple aspects including background information, technical specifications, usage guidelines, and best practices. The content is organized in a way that makes it easy to scan and digest, even though it contains a significant amount of information. This type of detailed description is particularly useful for complex items that require thorough explanation and context. Users can benefit from understanding all the nuances and considerations related to this particular item.',
      'An extensive writeup covering all aspects of this entry. This includes historical context, current implementation details, future roadmap considerations, and integration points with other systems. The description aims to provide a complete picture so that stakeholders at all levels can understand the significance and implications. Additional information includes performance metrics, security considerations, compliance requirements, and maintenance procedures. This level of detail ensures that anyone reviewing this item has access to comprehensive documentation without needing to consult external resources.'
    ];

    // 40% short, 40% medium, 20% long for good variation
    const random = Math.random();
    if (random < 0.4) {
      return shortDescriptions[Math.floor(Math.random() * shortDescriptions.length)];
    } else if (random < 0.8) {
      return mediumDescriptions[Math.floor(Math.random() * mediumDescriptions.length)];
    } else {
      return longDescriptions[Math.floor(Math.random() * longDescriptions.length)];
    }
  }

  /**
   * Handle scroll events
   */
  onScroll(position: number): void {
    this.lastScrollPosition.set(position);
  }

  private createRuntimeItem(prefix: string): DemoItem {
    const timestamp = new Date();
    const id = `RUNTIME-${timestamp.getTime()}`;
    return {
      id,
      title: `${prefix} ${id}`,
      description: 'Item injected at runtime to validate scroller list operations.',
      category: 'Enhancement',
      timestamp: timestamp.toLocaleString()
    };
  }

  toDemoItem(item: unknown): DemoItem {
    return item as DemoItem;
  }

  /**
   * Get CSS class for category badge
   */
  getCategoryClass(category: string): string {
    const classMap: { [key: string]: string } = {
      'News': 'badge-info',
      'Feature': 'badge-success',
      'Bug Fix': 'badge-danger',
      'Enhancement': 'badge-warning',
      'Documentation': 'badge-secondary'
    };
    return classMap[category] || 'badge-secondary';
  }
}
