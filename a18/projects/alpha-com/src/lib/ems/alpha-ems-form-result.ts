export class AlphaEmsFormResult<TB> {
  action: 'C' | 'R' | 'U' | 'D';
  data: TB | undefined;

  constructor(
    action: 'C' | 'R' | 'U' | 'D',
    data?: TB) {
    this.action = action;
    this.data = data;
  }
}
