import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
  OnDestroy
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

  // Exposed signals for template
  paddingTop = signal(0);
  paddingBottom = signal(0);

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

  busy = computed(() => this.modelData.busy);

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

    const sb = new AlphaPrimeScrollerBag(this.rows);

    sb.analyseRows(
      this.modelData.contentHeight,
      this.fixedHeight(),
      this.modelData.spaceAbove,
      this.modelData.panelBottom
    );

    this.modelData.spaceBellow = Math.round(
      this.modelData.contentHeight -
      this.modelData.spaceAbove -
      this.modelData.panelHeight
    );

    // Check if we need to slide up
    if (
      this.paddingTop() > 0 &&
      this.modelData.spaceAbove <= this.paddingTop() &&
      this.modelData.visibleFrom !== 0
    ) {
      this.slideUp(sb);
      return;
    }

    // Check if we need to load more data or slide down
    if (this.modelData.spaceBellow <= this.paddingBottom() + 5) {

      if (this.modelData.visibleTo < this.modelData.nbRows) {
        this.slideDown(sb);
        return;
      } else {
        // Need to get more data from server
        if (this.modelData.busy || this._allItemsFetched()) {
          this.updatePaddings(
            sb.totalHeightOfInvisibleRowsAbove,
            sb.totalHeightOfInvisibleRowsBellow
          );
          return;
        }

        // Load more data
        this.stopListening();
        const curPos = spDiv.scrollTop;

        this.modelData.loadNextItems(sb.firstVisibleRow)
          .subscribe({
            next: (hasItems) => {
              this.updatePaddings(
                sb.totalHeightOfInvisibleRowsAbove,
                sb.totalHeightOfInvisibleRowsBellow
              );
              spDiv.scrollTop = curPos;
              if (hasItems) {
                this.startListening();
              } else {
                this._allItemsFetched.set(true);
                this.allItemsFetched.emit(true);
              }
            },
            error: (error) => {
              console.error('Scroll load error:', error);
              this.updatePaddings(
                sb.totalHeightOfInvisibleRowsAbove,
                sb.totalHeightOfInvisibleRowsBellow
              );
              this.startListening();
            }
          });
      }
      return;
    }
  }

  private slideUp(sb: AlphaPrimeScrollerBag): void {
    this.modelData.slideItems(sb.firstVisibleRow, sb.lastVisibleRow);
    this.updatePaddings(
      sb.totalHeightOfInvisibleRowsAbove,
      sb.totalHeightOfInvisibleRowsBellow
    );
  }

  private slideDown(sb: AlphaPrimeScrollerBag): void {
    this.modelData.slideItems(
      sb.firstVisibleRow,
      this.modelData.visibleTo + this.modelData.take
    );
    this.updatePaddings(
      sb.totalHeightOfInvisibleRowsAbove,
      sb.totalHeightOfInvisibleRowsBellow
    );
  }
}
