import {
  AlphaPrimeScrollerModel
} from '../../../../projects/alpha-prime/src/lib/components/alpha-prime-scroller/alpha-prime-scroller-model';

export interface IScrollerDemoCardData {
  id: string;
  title: string;
  description: string;
}

export class ScrollerDemoCardData implements IScrollerDemoCardData {
  id: string;
  title: string;
  description: string;

  constructor(
    id: string,
    title: string,
    description: string) {
    this.id = id;
    this.title = title;
    this.description = description;
  }

}

export class ScrollerDemoModel extends AlphaPrimeScrollerModel<ScrollerDemoCardData> {}
