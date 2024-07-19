
export interface IAlphaPrimeModalConfig {
  data?: any,
  header?: string,
  footer?: string,
  width?: string,
  height?: string,
  closeOnEscape?: boolean,
  focusOnShow?: boolean,
  focusTrap?: boolean,
  baseZIndex?: number,
  autoZIndex?: boolean,
  // noinspection SpellCheckingInspection
  dismissableMask?: boolean,
  rtl?: boolean,
  style?: Object,
  contentStyle?: Object,
  styleClass?: string,
  transitionOptions?: string,
  closable?: boolean,
  maskStyleClass?: string,
  resizable?: boolean,
  /** true by default */
  draggable?: boolean,
  keepInViewport?: boolean,
  minX?: number,
  maxX?: number,
  maximizable?: boolean,
  maximizeIcon?: string,
  minimizeIcon?: string,
  /*
  * "left", "right", "top-left", "top-right", "bottom-left" or "bottom-right".
  * */
  position?: 'left' | 'right' |
             'top-left' | 'top-right' |
             'bottom-left' | 'bottom-right',
  closeArialLabel?: string,
  appendTo?: any,
  duplicate?: boolean,
  breakpoints?: any
}
