import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlphaPrimeScroller } from '../../../projects/alpha-prime/src/lib/components/alpha-prime-scroller/alpha-prime-scroller';
import { AlphaPrimeScrollerModel } from '../../../projects/alpha-prime/src/lib/components/alpha-prime-scroller/alpha-prime-scroller-model';
import { Observable, Subscriber } from 'rxjs';

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
  imports: [CommonModule, AlphaPrimeScroller],
  templateUrl: './scroller.component.html',
  styleUrl: './scroller.component.css'
})
export class ScrollerComponent implements OnInit {

  // Configuration signals
  useFixedHeight = signal(false);
  fixedHeightValue = signal(80);
  showProgressBar = signal(true);
  pageSize = signal(20);

  // State signals
  scrollerModel = signal<AlphaPrimeScrollerModel<DemoItem> | undefined>(undefined);
  lastScrollPosition = signal(0);
  allItemsFetched = signal(false);
  isLoading = signal(false);

  // Derived signals
  totalItems = computed(() => this.scrollerModel()?.nbRows ?? 0);
  visibleRange = computed(() => {
    const model = this.scrollerModel();
    if (!model) return '0 - 0';
    return `${model.visibleFrom + 1} - ${model.visibleTo}`;
  });

  // Sample data repository
  private allItems: DemoItem[] = [];

  constructor() {
    this.generateSampleData();
  }

  ngOnInit(): void {
    this.initializeScroller();
  }

  /**
   * Initialize the scroller with a data feed function
   */
  private initializeScroller(): void {
    const feed = (skip: number, take: number): Observable<DemoItem[]> => {
      return new Observable((subscriber: Subscriber<DemoItem[]>) => {
        // Simulate network delay
        setTimeout(() => {
          const items = this.allItems.slice(skip, skip + take);
          subscriber.next(items);
          subscriber.complete();
        }, 800);
      });
    };

    const model = new AlphaPrimeScrollerModel<DemoItem>(feed, this.pageSize());
    this.scrollerModel.set(model);

    // Set up callbacks
    model.onLoading = () => {
      this.isLoading.set(true);
    };

    model.onLoaded = () => {
      this.isLoading.set(false);
    };

    // Load initial items
    model.loadItems().subscribe({
      next: () => console.log('Initial load complete'),
      error: (err) => console.error('Load error:', err)
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
   * Generate random description text
   */
  private generateDescription(): string {
    const descriptions = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui.'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  /**
   * Handle scroll events
   */
  onScroll(position: number): void {
    this.lastScrollPosition.set(position);
  }

  /**
   * Handle completion of data loading
   */
  onAllItemsFetched(): void {
    console.log('All items have been fetched');
    this.allItemsFetched.set(true);
  }

  /**
   * Track by function for *ngFor
   */
  trackByFn(index: number, row: any): string {
    return row.data.id;
  }

  /**
   * Refresh the entire list
   */
  refreshList(): void {
    const model = this.scrollerModel();
    if (model) {
      model.rows = [];
      model.visibleFrom = 0;
      model.visibleTo = 0;
      model.endReached = false;
      this.allItemsFetched.set(false);
      model.loadItems().subscribe();
    }
  }

  /**
   * Scroll to top
   */
  scrollToTop(): void {
    const scrollPanel = document.querySelector('.scroll-panel');
    if (scrollPanel) {
      scrollPanel.scrollTop = 0;
    }
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

  /**
   * Get display height value
   */
  getDisplayHeight(): number {
    return this.useFixedHeight() ? this.fixedHeightValue() : -1;
  }
}
