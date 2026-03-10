export interface IAlphaPrimeSwitchOption {
  id: string;
  caption: string;
  selected: boolean;
  /** optional localStorage item key that can store the selected value */
  lsItemKey?: string;
}

export class AlphaPrimeSwitchOption implements IAlphaPrimeSwitchOption {
  id: string;
  caption: string;
  selected: boolean;
  lsItemKey?: string;

  /**
   * When lsItemKey is provided, selected is initialized from localStorage if available.
   */
  constructor(
    id: string,
    caption: string,
    selected: boolean,
    lsItemKey?: string
  ) {
    this.id = id;
    this.caption = caption;
    this.selected = selected;
    this.lsItemKey = lsItemKey;

    if (lsItemKey) {
      const lsItem = localStorage.getItem(lsItemKey);
      if (lsItem) {
        this.selected = lsItem === 'true';
      }
    }
  }
}

