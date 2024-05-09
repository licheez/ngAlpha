export interface IAlphaEmsEditContainer<TB, TE> {
  ei: TE;
  body: TB | undefined;
}

export class AlphaEmsEditContainer<TB, TE>
  implements IAlphaEmsEditContainer<TB, TE> {
  ei: TE;
  body: TB | undefined;

  constructor(ei: TE, body?: TB) {
    this.ei = ei;
    this.body = body;
  }

  static factorFromDso<TB, TE>(
    dso: any,
    factorEi: (eiDso: any) => TE,
    factorBody: (bodyDso: any) => TB) {
    const ei = factorEi(dso.ei);
    const body = dso.body ? factorBody(dso.body) : undefined;
    return new AlphaEmsEditContainer(ei, body);
  }

}
