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
    if (
      this.paddingTop() > 0 &&
      this.modelData.spaceAbove <= this.paddingTop() &&
      this.modelData.visibleFrom !== 0
    ) {
      console.log('>>> DECISION: SLIDE UP <<<');
      this.slideUp(sb);
      return;
    }

    // Check if we need to load more data or slide down
    if (this.modelData.spaceBellow <= this.paddingBottom() + 5) {
      console.log('>>> At bottom threshold: spaceBellow=', this.modelData.spaceBellow, '<=', this.paddingBottom() + 5);

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
        const curPos = spDiv.scrollTop;

        this.modelData.loadNextItems(fromRow)
          .subscribe({
            next: (hasItems) => {
              console.log('>>> LOAD COMPLETE <<<');
              console.log('Load result:', {
                hasItems,
                newTotal: this.modelData.nbRows,
                newVisibleRange: `${this.modelData.visibleFrom}-${this.modelData.visibleTo}`,
                scrollTop: curPos
              });

              this.busy.set(false);
              this.updatePaddings(
                sb.totalHeightOfInvisibleRowsAbove,
                sb.totalHeightOfInvisibleRowsBellow
              );
              spDiv.scrollTop = curPos;

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
    const fromRow = sb.firstVisibleRow >= 0 ? sb.firstVisibleRow : 0;
    const toRow = sb.lastVisibleRow >= 0 ? sb.lastVisibleRow + 1 : this.modelData.visibleTo;

    console.log('>>> slideUp BEFORE <<<', {
      bagFirstVisible: sb.firstVisibleRow,
      bagLastVisible: sb.lastVisibleRow,
      calculatedFrom: fromRow,
      calculatedTo: toRow,
      currentVisibleRange: `${this.modelData.visibleFrom}-${this.modelData.visibleTo}`,
      totalRows: this.modelData.nbRows,
      invisibleAbove: sb.totalHeightOfInvisibleRowsAbove,
      invisibleBelow: sb.totalHeightOfInvisibleRowsBellow
    });

    this.modelData.slideItems(fromRow, toRow);

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
    const fromRow = sb.firstVisibleRow >= 0 ? sb.firstVisibleRow : this.modelData.visibleFrom;
    const toRow = sb.lastVisibleRow >= 0 ? sb.lastVisibleRow + 1 : this.modelData.visibleTo;

    // Slide the window to show more items below
    const newTo = Math.min(toRow + this.modelData.take, this.modelData.nbRows);

    console.log('>>> slideDown BEFORE <<<', {
      bagFirstVisible: sb.firstVisibleRow,
      bagLastVisible: sb.lastVisibleRow,
      calculatedFrom: fromRow,
      calculatedToRow: toRow,
      calculatedNewTo: newTo,
      take: this.modelData.take,
      currentVisibleRange: `${this.modelData.visibleFrom}-${this.modelData.visibleTo}`,
      totalRows: this.modelData.nbRows,
      invisibleAbove: sb.totalHeightOfInvisibleRowsAbove,
      invisibleBelow: sb.totalHeightOfInvisibleRowsBellow
    });

    this.modelData.slideItems(fromRow, newTo);

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
