export interface IAlphaPrimeSwitchOption {
  id: string;
  caption: string;
  selected: boolean;
  /** optional localStorage item key that can store
   * the value for this.selected
   */
  lsItemKey?: string
}
export class AlphaPrimeSwitchOption
  implements IAlphaPrimeSwitchOption {
  id: string;
  caption: string;
  selected: boolean;
  lsItemKey?: string

  /** when specifying a lsItemKey the
   * value of the selected param will
   * be overwritten by the local storage
   * value (true/false) if any
   */
  constructor(
    id: string,
    caption: string,
    selected: boolean,
    lsItemKey?: string) {
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
