import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  effect,
  input,
  output,
  signal,
  viewChild,
  OnDestroy,
  inject
} from '@angular/core';
import { AlphaPrimeScrollerModel } from './alpha-prime-scroller-model';
import { AlphaPrimeScrollerRow } from './alpha-prime-scroller-row';
import { AlphaPrimeScrollerBag } from './alpha-prime-scroller-bag';
import { AlphaPrimeDebugTagComponent } from '../alpha-prime-debug-tag/alpha-prime-debug-tag.component';
import { AlphaPrimeProgressBarComponent } from '../alpha-prime-progress-bar/alpha-prime-progress-bar.component';

@Component({
  selector: 'alpha-prime-scroller',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    AlphaPrimeProgressBarComponent
  ],
  templateUrl: './alpha-prime-scroller.html',
  styleUrl: './alpha-prime-scroller.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'alpha-prime-scroller'
  }
})
export class AlphaPrimeScroller implements AfterViewInit, OnDestroy {

  // Input signals (public required by Angular 20)
  model = input<AlphaPrimeScrollerModel<any> | undefined>(undefined);
  mirror = input(false);
  showProgressBar = input(true);
  fixedHeight = input(-1);

  // Signal outputs
  allItemsFetched = output<boolean>();
  scrolled = output<number>();

  // Internal state
  private _allItemsFetched = signal(false);
  private _scrollListener: ((event: Event) => void) | null = null;
  private cdr = inject(ChangeDetectorRef);
  private _justSlidUp = false; // Track if we just slid up

  // Exposed signals for template
  paddingTop = signal(0);
  paddingBottom = signal(0);
  busy = signal(false);

  private scrollPanelRef = viewChild<ElementRef<HTMLDivElement>>('scrollPanel');

  private _model: AlphaPrimeScrollerModel<any> | undefined;

  constructor() {
    // Watch for model changes using effect()
    effect(() => {
      const newModel = this.model();
      if (newModel) {
        this._model = newModel;
        // Reset padding when model changes (bug fix - reset immediately)
        this.resetPadding();
        this._allItemsFetched.set(false);

        newModel.onLoaded = () => {
          this._allItemsFetched.set(newModel.endReached);
          // Reset padding when data loads (bug fix)
          this.resetPadding();
          if (newModel.endReached) {
            this.allItemsFetched.emit(true);
          }
        };
      }
    });
  }

  private resetPadding(): void {
    this.paddingTop.set(0);
    this.paddingBottom.set(0);
  }

  get modelData(): AlphaPrimeScrollerModel<any> {
    return this._model
      ? this._model
      : {
        rows: [],
        spaceAbove: -1,
        panelHeight: -1,
        panelBottom: -1,
        contentHeight: -1,
        spaceBellow: -1,
        paddingTop: -1,
        paddingBottom: -1,
        busy: false
      } as unknown as AlphaPrimeScrollerModel<any>;
  }

  get rows(): AlphaPrimeScrollerRow<any>[] {
    return this.modelData.rows;
  }


  private get scrollPanel(): HTMLDivElement {
    const ref = this.scrollPanelRef();
    return ref
      ? ref.nativeElement
      : {
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0
      } as unknown as HTMLDivElement;
  }

  ngAfterViewInit(): void {
    this.startListening();
  }

  ngOnDestroy(): void {
    this.stopListening();
  }

  private startListening(): void {
    if (this.scrollPanelRef()) {
      this._scrollListener = this.handleScroll.bind(this);
      this.scrollPanel.addEventListener('scroll', this._scrollListener);
    }
  }

  private stopListening(): void {
    if (this.scrollPanelRef() && this._scrollListener) {
      this.scrollPanel.removeEventListener('scroll', this._scrollListener);
      this._scrollListener = null;
    }
  }

  private updatePaddings(top: number, bottom: number): void {
    this.modelData.paddingTop = top;
    this.modelData.paddingBottom = bottom;
    this.paddingTop.set(top);
    this.paddingBottom.set(bottom);
  }

  private handleScroll(/*event: Event*/): void {
    if (this._model === undefined) {
      return;
    }

    const spDiv = this.scrollPanel;
    this.modelData.spaceAbove = spDiv.scrollTop;
    this.scrolled.emit(this.modelData.spaceAbove);

    this.modelData.panelHeight = spDiv.clientHeight;
    this.modelData.panelBottom = this.modelData.spaceAbove + this.modelData.panelHeight;
    this.modelData.contentHeight = spDiv.scrollHeight;

    console.log('=== SCROLL EVENT ===');
    console.log('Scroll position:', {
      scrollTop: spDiv.scrollTop,
      scrollHeight: spDiv.scrollHeight,
      clientHeight: spDiv.clientHeight,
      spaceAbove: this.modelData.spaceAbove,
      panelBottom: this.modelData.panelBottom,
      contentHeight: this.modelData.contentHeight
    });

    const sb = new AlphaPrimeScrollerBag(this.rows);

    sb.analyseRows(
      this.modelData.contentHeight,
      this.fixedHeight(),
      this.modelData.spaceAbove,
      this.modelData.panelBottom
    );

    console.log('Analyzed rows:', {
      totalRows: this.rows.length,
      firstVisibleRow: sb.firstVisibleRow,
      lastVisibleRow: sb.lastVisibleRow,
      invisibleAbove: sb.totalHeightOfInvisibleRowsAbove,
      invisibleBelow: sb.totalHeightOfInvisibleRowsBellow,
      currentVisible: `${this.modelData.visibleFrom}-${this.modelData.visibleTo}`,
      currentPadding: `top=${this.paddingTop()}, bottom=${this.paddingBottom()}`
    });

    this.modelData.spaceBellow = Math.round(
      this.modelData.contentHeight -
      this.modelData.spaceAbove -
      this.modelData.panelHeight
    );

    console.log('spaceBellow=', this.modelData.spaceBellow, 'paddingBottom=', this.paddingBottom());

    // Check if we need to slide up
    // Trigger when we have significant padding above AND viewing items in upper part of visible range
    const shouldSlideUp = this.paddingTop() > 200 &&
                         sb.firstVisibleRow >= 0 &&
                         sb.firstVisibleRow < this.modelData.visibleFrom + 10;

    if (shouldSlideUp) {
      console.log('>>> DECISION: SLIDE UP <<<', {
        visibleFrom: this.modelData.visibleFrom,
        visibleTo: this.modelData.visibleTo,
        firstVisibleRow: sb.firstVisibleRow,
        paddingTop: this.paddingTop()
      });
      this._justSlidUp = true;
      this.slideUp(sb);
      return;
    }

    // Check if we need to slide down (viewing items near end of visible range)
    // Trigger when viewing items in the LOWER part of visible range
    const shouldSlideDown = this.modelData.visibleTo < this.modelData.nbRows &&
                           sb.lastVisibleRow >= 0 &&
                           sb.lastVisibleRow >= this.modelData.visibleTo - 10; // Within last 10 items

    if (shouldSlideDown) {
      console.log('>>> DECISION: SLIDE DOWN (viewing near end of visible range) <<<', {
        visibleTo: this.modelData.visibleTo,
        nbRows: this.modelData.nbRows,
        lastVisibleRow: sb.lastVisibleRow
      });
      this.slideDown(sb);
      return;
    }

    // Check if we need to load more data
    // Only trigger when:
    // 1. We're physically near the bottom (spaceBellow is small) AND
    // 2. We're at the end of visible range
    // This prevents loading too early when just viewing items near the end
    const isPhysicallyNearBottom = this.modelData.spaceBellow <= Math.max(200, this.paddingBottom() + 5);
    const isAtEndOfVisible = this.modelData.visibleTo >= this.modelData.nbRows;
    const needsAction = !this._justSlidUp && isPhysicallyNearBottom && isAtEndOfVisible;

    // Clear the flag for next scroll event
    if (this._justSlidUp) {
      console.log('>>> Skipping bottom check - just slid up <<<');
      this._justSlidUp = false;
      this.updatePaddings(
        sb.totalHeightOfInvisibleRowsAbove,
        sb.totalHeightOfInvisibleRowsBellow
      );
      return;
    }

    if (needsAction) {
      console.log('>>> At bottom threshold:', {
        spaceBellow: this.modelData.spaceBellow,
        paddingBottom: this.paddingBottom(),
        isPhysicallyNearBottom,
        isAtEndOfVisible,
        visibleTo: this.modelData.visibleTo,
        nbRows: this.modelData.nbRows
      });

      if (this.modelData.visibleTo < this.modelData.nbRows) {
        console.log('>>> DECISION: SLIDE DOWN (more items available) <<<');
        this.slideDown(sb);
        return;
      } else {
        console.log('>>> At end of loaded items, visibleTo=', this.modelData.visibleTo, 'nbRows=', this.modelData.nbRows);

        // Need to get more data from server
        if (this.busy() || this._allItemsFetched()) {
          console.log('>>> DECISION: SKIP (busy=', this.busy(), 'allFetched=', this._allItemsFetched(), ') <<<');
          this.updatePaddings(
            sb.totalHeightOfInvisibleRowsAbove,
            sb.totalHeightOfInvisibleRowsBellow
          );
          return;
        }

        // Load more data
        const fromRow = sb.firstVisibleRow >= 0 ? sb.firstVisibleRow : this.modelData.visibleFrom;
        console.log('>>> DECISION: LOAD MORE DATA <<<');
        console.log('Loading params:', {
          currentRows: this.modelData.nbRows,
          firstVisibleRow: sb.firstVisibleRow,
          usingFromRow: fromRow,
          currentVisibleRange: `${this.modelData.visibleFrom}-${this.modelData.visibleTo}`
        });

        this.stopListening();
        this.busy.set(true);

        this.modelData.loadNextItems(fromRow)
          .subscribe({
            next: (hasItems) => {
              console.log('>>> LOAD COMPLETE <<<');
              console.log('Load result:', {
                hasItems,
                newTotal: this.modelData.nbRows,
                newVisibleRange: `${this.modelData.visibleFrom}-${this.modelData.visibleTo}`
              });

              this.busy.set(false);
              this.updatePaddings(
                sb.totalHeightOfInvisibleRowsAbove,
                sb.totalHeightOfInvisibleRowsBellow
              );

              // Don't reset scrollTop - let browser maintain natural position
              // Resetting causes scroll handle to jump and triggers unwanted scroll events

              this.cdr.markForCheck();

              if (hasItems) {
                setTimeout(() => {
                  console.log('>>> RESTARTING SCROLL LISTENER <<<');
                  this.startListening();
                }, 100);
              } else {
                console.log('>>> ALL ITEMS FETCHED <<<');
                this._allItemsFetched.set(true);
                this.allItemsFetched.emit(true);
              }
            },
            error: (error) => {
              console.error('>>> LOAD ERROR <<<', error);
              this.busy.set(false);
              this.updatePaddings(
                sb.totalHeightOfInvisibleRowsAbove,
                sb.totalHeightOfInvisibleRowsBellow
              );
              this.cdr.markForCheck();
              setTimeout(() => {
                this.startListening();
              }, 100);
            }
          });
      }
      return;
    }

    console.log('>>> DECISION: UPDATE PADDINGS ONLY <<<');
    this.updatePaddings(
      sb.totalHeightOfInvisibleRowsAbove,
      sb.totalHeightOfInvisibleRowsBellow
    );
  }

  private slideUp(sb: AlphaPrimeScrollerBag): void {
    // When sliding up, maintain the window size and move it upward
    const windowSize = this.modelData.take * 3; // 30 items

    // Calculate new window position - move up by one page
    const newFrom = Math.max(0, this.modelData.visibleFrom - this.modelData.take);
    const newTo = Math.min(newFrom + windowSize, this.modelData.nbRows);

    console.log('>>> slideUp BEFORE <<<', {
      bagFirstVisible: sb.firstVisibleRow,
      bagLastVisible: sb.lastVisibleRow,
      currentVisibleRange: `${this.modelData.visibleFrom}-${this.modelData.visibleTo}`,
      calculatedNewFrom: newFrom,
      calculatedNewTo: newTo,
      windowSize: windowSize,
      totalRows: this.modelData.nbRows,
      invisibleAbove: sb.totalHeightOfInvisibleRowsAbove,
      invisibleBelow: sb.totalHeightOfInvisibleRowsBellow
    });

    this.modelData.slideItems(newFrom, newTo);

    console.log('>>> slideUp AFTER slideItems <<<', {
      newVisibleRange: `${this.modelData.visibleFrom}-${this.modelData.visibleTo}`
    });

    this.updatePaddings(
      sb.totalHeightOfInvisibleRowsAbove,
      sb.totalHeightOfInvisibleRowsBellow
    );

    console.log('>>> slideUp AFTER updatePaddings <<<', {
      paddingTop: this.paddingTop(),
      paddingBottom: this.paddingBottom()
    });

    // Trigger change detection after sliding
    this.cdr.markForCheck();
  }

  private slideDown(sb: AlphaPrimeScrollerBag): void {
    // When sliding down, we want to show the next batch of items
    // Not expand the window to show everything

    // Calculate the new window position
    const windowSize = this.modelData.take * 3; // Show 3 pages

    // Move the window forward by 'take' amount (one page)
    const newFrom = this.modelData.visibleFrom + this.modelData.take;
    const newTo = Math.min(newFrom + windowSize, this.modelData.nbRows);

    console.log('>>> slideDown BEFORE <<<', {
      bagFirstVisible: sb.firstVisibleRow,
      bagLastVisible: sb.lastVisibleRow,
      currentVisibleRange: `${this.modelData.visibleFrom}-${this.modelData.visibleTo}`,
      calculatedNewFrom: newFrom,
      calculatedNewTo: newTo,
      windowSize: windowSize,
      take: this.modelData.take,
      totalRows: this.modelData.nbRows,
      invisibleAbove: sb.totalHeightOfInvisibleRowsAbove,
      invisibleBelow: sb.totalHeightOfInvisibleRowsBellow
    });

    this.modelData.slideItems(newFrom, newTo);

    console.log('>>> slideDown AFTER slideItems <<<', {
      newVisibleRange: `${this.modelData.visibleFrom}-${this.modelData.visibleTo}`
    });

    this.updatePaddings(
      sb.totalHeightOfInvisibleRowsAbove,
      sb.totalHeightOfInvisibleRowsBellow
    );

    console.log('>>> slideDown AFTER updatePaddings <<<', {
      paddingTop: this.paddingTop(),
      paddingBottom: this.paddingBottom()
    });

    // Trigger change detection after sliding
    this.cdr.markForCheck();
  }
}
