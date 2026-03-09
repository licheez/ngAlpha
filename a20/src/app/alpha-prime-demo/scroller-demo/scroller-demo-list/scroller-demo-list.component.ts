import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, output, signal} from '@angular/core';
import {IScrollerDemoCardData, ScrollerDemoModel} from '../scroller-demo-model';
import {ScrollerDemoService} from '../scroller-demo-service';
import {
  AlphaPrimeDebugTagComponent
} from '../../../../../projects/alpha-prime/src/lib/components/alpha-prime-debug-tag/alpha-prime-debug-tag.component';
import {
  AlphaPrimeScroller
} from '../../../../../projects/alpha-prime/src/lib/components/alpha-prime-scroller/alpha-prime-scroller';
import {NgStyle} from '@angular/common';
import {ScrollerDemoCard} from '../scroller-demo-card/scroller-demo-card';

@Component({
  selector: 'app-scroller-demo',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    AlphaPrimeScroller,
    NgStyle,
    ScrollerDemoCard
  ],
  templateUrl: './scroller-demo-list.component.html',
  styleUrl: './scroller-demo-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollerDemoList implements OnInit {

  private readonly svc = inject(ScrollerDemoService);
  private readonly cdr = inject(ChangeDetectorRef);

  model = signal<ScrollerDemoModel | undefined>(undefined);
  selectedItem = signal<IScrollerDemoCardData | undefined>(undefined);
  logs = signal<string[]>([]);
  showLogs = signal(false);

  loaded =
    output<IScrollerDemoCardData | undefined>();
  itemSelected =
    output<IScrollerDemoCardData | undefined>();

  ngOnInit(): void {
    this.captureConsoleLogs();
    this.loadFirstPage();
  }

  private captureConsoleLogs(): void {
    const originalLog = console.log;
    const maxLogs = 100; // Keep last 100 log entries

    console.log = (...args: any[]) => {
      // Call original console.log
      originalLog.apply(console, args);

      // Capture for display
      const logMessage = args.map(arg => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg, null, 2);
        }
        return String(arg);
      }).join(' ');

      const currentLogs = this.logs();
      const newLogs = [...currentLogs, `[${new Date().toLocaleTimeString()}] ${logMessage}`];

      // Keep only last maxLogs entries
      if (newLogs.length > maxLogs) {
        newLogs.splice(0, newLogs.length - maxLogs);
      }

      this.logs.set(newLogs);
      this.cdr.markForCheck();
    };
  }

  toggleLogs(): void {
    this.showLogs.set(!this.showLogs());
  }

  clearLogs(): void {
    this.logs.set([]);
  }

  copyLogs(): void {
    const logsText = this.logs().join('\n');
    navigator.clipboard.writeText(logsText).then(() => {
      alert('Logs copied to clipboard!');
    });
  }

  private loadFirstPage(): void {
    console.log('ScrollerDemoList: loading first page');
    const newModel = new ScrollerDemoModel(
      (skip: number, take: number) => {
        return this.svc.list(skip, take);
      },
      10 // Take 10 items per page
    );

    // Set up callback to trigger change detection when items are loaded
    const originalOnLoaded = newModel.onLoaded;
    newModel.onLoaded = (item) => {
      originalOnLoaded(item);
      this.cdr.markForCheck();
    };

    this.model.set(newModel);

    newModel.loadItems().subscribe({
      next: item => {
        console.log("ScrollerDemoList: loaded first page, nbRows=", newModel.nbRows, "first item:", item);
        this.selectedItem.set(item);
        this.loaded.emit(item);
        this.cdr.markForCheck();
      },
      error: e => {
        console.error('ScrollerDemoList: error loading first page', e);
      }
    });
  }

  onSelectRow(item: IScrollerDemoCardData): void {
    console.log('Selected item:', item.title);
    this.selectedItem.set(item);
    this.itemSelected.emit(item);
  }


}
