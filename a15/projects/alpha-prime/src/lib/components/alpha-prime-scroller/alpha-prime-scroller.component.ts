import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {AlphaPrimeScrollerModel} from "./alpha-prime-scroller-model";
import {AlphaPrimeScrollerRow} from "./alpha-prime-scroller-row";
import {AlphaPrimeDebugTagComponent} from "../alpha-prime-debug-tag/alpha-prime-debug-tag.component";
import {AlphaPrimeProgressBarComponent} from "../alpha-prime-progress-bar/alpha-prime-progress-bar.component";
import {NgIf} from "@angular/common";
import {AlphaPrimeScrollerBag} from "./alpha-prime-scroller-bag";

@Component({
  selector: 'alpha-prime-scroller',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    AlphaPrimeDebugTagComponent,
    AlphaPrimeProgressBarComponent,
    NgIf
  ],
  templateUrl: './alpha-prime-scroller.component.html',
  styleUrls: ['./alpha-prime-scroller.component.css']
})
export class AlphaPrimeScrollerComponent  implements OnDestroy, AfterViewInit  {
  private _allItemsFetched = false;
  paddingTop = 0; // determines height of top filler
  paddingBottom = 0; // determines height of bottom filler

  get busy(): boolean {
    return this.model.busy
  }

  private _model: AlphaPrimeScrollerModel<any> | undefined;
  @Input()
  set model(model: AlphaPrimeScrollerModel<any>) {
    this._model = model;
    model.onLoaded = () => {
      this._allItemsFetched = model.endReached;
      this.paddingTop = 0;
      this.paddingBottom = 0;
      if (model.endReached) {
        this.allItemsFetched.emit(true);
      }
    };
  }
  /**
   * Retrieves the model of the AlphaPrimeScroller.
   *
   * @returns {AlphaPrimeScrollerModel<any>} The model of the AlphaPrimeScroller.
   * or a dummy object if the _model is undefined
   */
  get model(): AlphaPrimeScrollerModel<any> {
    return this._model
      ? this._model
      : {
         rows: [],
         busy: false
        } as unknown as AlphaPrimeScrollerModel<any>;
  }
  get rows(): AlphaPrimeScrollerRow<any>[] {
    return this.model.rows;
  }
  @Input() mirror = false;
  @Input() showProgressBar = true;
  @Input() fixedHeight = -1;

  @Output() allItemsFetched = new EventEmitter<boolean>();
  @Output() scrolled = new EventEmitter<number>(); // sends the scrollTop position to the caller

  @ViewChild('scrollPanel') scrollPanelRef: ElementRef<HTMLDivElement> | undefined;
  /**
   * Returns the scroll panel element.
   *
   * @return {HTMLDivElement} The scroll panel element.
   * If the scrollPanelRef is defined, it returns the nativeElement
   * of the scrollPanelRef. Otherwise, it returns a dummy HTMLDivElement
   * object with default scroll properties.
   */
  private get scrollPanel(): HTMLDivElement {
    return this.scrollPanelRef
      ? this.scrollPanelRef.nativeElement
      : {
          scrollTop: 0,
          scrollHeight: 0,
          clientHeight: 0
        } as unknown as HTMLDivElement;
  }

  ngOnDestroy(): void {
    this.stopListening();
  }

  ngAfterViewInit() {
    this.startListening();
  }

  startListening() {
    if (this.scrollPanelRef) {
      this.scrollPanel.addEventListener('scroll',
        this.handleScroll.bind(this));
    }
  }

  stopListening() {
    if (this.scrollPanelRef) {
      this.scrollPanel.removeEventListener('scroll',
        this.handleScroll.bind(this));
    }
  }

  private updatePaddings(top: number, bottom: number): void {
    this.paddingTop = top;
    this.paddingBottom = bottom;
    // console.log(top, bottom);
  }

  handleScroll(/*event: Event*/): void {
    if (this._model === undefined) {
      return;
    }
    const spDiv = this.scrollPanel;
    const spaceAbove = spDiv.scrollTop;
    this.scrolled.emit(spaceAbove);
    const panelHeight = spDiv.clientHeight;
    const panelBottom = panelHeight + spaceAbove;
    const contentHeight = spDiv.scrollHeight;

    const sb = new AlphaPrimeScrollerBag (this.rows)

    sb.analyseRows(
      contentHeight, this.fixedHeight, spaceAbove, panelBottom);

    const spaceBellow = Math.round(contentHeight - spaceAbove - panelHeight);

    // console.log(`panelHeight:${panelHeight}-contentHeight:${contentHeight}`);
    // console.log(`sa:${spaceAbove}-sb:${spaceBellow}-fvri:${firstVisibleRow}-pt:${this.paddingTop}-lvri:${lastVisibleRow}-pb:${this.paddingBottom}`);
    // console.log(`padTop:${this.paddingTop}, padBtm:${this.paddingBottom}`);

    if (this.paddingTop > 0
      && spaceAbove <= this.paddingTop
      && this.model.visibleFrom !== 0) {
      this.slideUp(sb);
      return;
    }

    if (spaceBellow <= this.paddingBottom + 5) {

      if (this.model.visibleTo < this.model.nbRows) {
        this.slideDown(sb);
        return;

      } else {

        // need to get some data from the server

        // there is already a request or
        // the last request was not returning any rows
        if (this.model.busy || this._allItemsFetched) {
          this.updatePaddings(
            sb.totalHeightOfInvisibleRowsAbove,
            sb.totalHeightOfInvisibleRowsBellow);
          return;
        }

        // get more data from the feeder
        this.stopListening();
        const curPos = spDiv.scrollTop;
        this.model.loadNextItems(sb.firstVisibleRow)
          .subscribe({
            next: hasItems => {
              this.updatePaddings(
                sb.totalHeightOfInvisibleRowsAbove,
                sb.totalHeightOfInvisibleRowsBellow);
              spDiv.scrollTop = curPos;
              if (hasItems) {
                this.startListening();
              } else {
                this._allItemsFetched = true;
                this.allItemsFetched.emit(true);
              }
              return;
            },
            error: error => {
              console.error(error);
              this.updatePaddings(
                sb.totalHeightOfInvisibleRowsAbove,
                sb.totalHeightOfInvisibleRowsBellow);
              this.startListening();
              return;
            }
          });
      }
      return;
    }

  }

  slideUp(sb: AlphaPrimeScrollerBag): void{
    this.model.slideItems(sb.firstVisibleRow, sb.lastVisibleRow);
    this.updatePaddings(
      sb.totalHeightOfInvisibleRowsAbove,
      sb.totalHeightOfInvisibleRowsBellow);
  }

  slideDown(sb: AlphaPrimeScrollerBag): void {
    this.model.slideItems(sb.firstVisibleRow,
      this.model.visibleTo + this.model.take);
    this.updatePaddings(
      sb.totalHeightOfInvisibleRowsAbove,
      sb.totalHeightOfInvisibleRowsBellow);
  }


}

