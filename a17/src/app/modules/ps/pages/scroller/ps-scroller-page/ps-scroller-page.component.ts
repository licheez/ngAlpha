import {Component, OnInit} from '@angular/core';
import {PsScrollerApi} from "../ps-scroller-api";
import {
  AlphaPrimeProgressBarComponent,
  AlphaPrimeRemainingHeightDirective,
  AlphaPrimeScrollerComponent,
  AlphaPrimeScrollerModel
} from "@pvway-dev/alpha-prime";
import {PsScrollerItem} from "../ps-scroller-item";
import {Observable} from "rxjs";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {DividerModule} from "primeng/divider";
import {SliderModule} from "primeng/slider";
import {FormsModule} from "@angular/forms";

class Model extends AlphaPrimeScrollerModel<PsScrollerItem> {
}

@Component({
  selector: 'app-ps-scroller-page',
  standalone: true,
  imports: [
    NgIf,
    AlphaPrimeScrollerComponent,
    AlphaPrimeRemainingHeightDirective,
    NgForOf,
    NgStyle,
    DividerModule,
    SliderModule,
    FormsModule,
    AlphaPrimeProgressBarComponent
  ],
  templateUrl: './ps-scroller-page.component.html',
  styleUrl: './ps-scroller-page.component.scss'
})
export class PsScrollerPageComponent implements OnInit {

  api = new PsScrollerApi();
  model: Model | undefined;

  sliderVisible = false;
  sliderRange = [0, 100];
  sliderMax = 100;

  get modelDims(): string {
    if (this.model === undefined) {
      return 'undefined';
    }
    return this.model.dims;
  }

  get modelStats(): string {
    if (this.model === undefined) {
      return 'undefined';
    }
    const a = this.model.rows
      .filter(x => x.position === 'above')
      .length;
    const pa = this.model.rows
      .filter(x => x.position === 'partiallyAbove')
      .length;
    const fv = this.model.rows
      .filter(x => x.position === 'fullyVisible')
      .length;
    const pb = this.model.rows
      .filter(x => x.position === 'partiallyBellow')
      .length;
    const b = this.model.rows
      .filter(x => x.position === 'bellow')
      .length;
    return `a:${a} pa:${pa} fv:${fv} pb:${pb} b:${b}`;
  }

  feed:
    (skip: number, take: number) => Observable<PsScrollerItem[]> =
    (skip: number, take: number) => this.api.list(skip, take);

  ngOnInit() {
    this.loadFirstPage();
  }

  onScrolled(): void {
    this.sliderMax = this.model!.contentHeight;
    const a = this.model!.spaceAbove;
    const b = this.model!.panelBottom;
    this.sliderRange = [a, b];
    this.sliderVisible = true;
  }

  private loadFirstPage(): void {
    this.model = new Model(this.feed, 10);
    this.model.loadItems().subscribe();
  }

}
