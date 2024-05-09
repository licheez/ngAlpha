
export interface IAlphaEmsBaseApiEvent<TB> {
  action: 'create' | 'update' | 'delete';
  body: TB | null;
  keys: string[];
}

export class AlphaEmsBaseApiEvent<TB>
  implements IAlphaEmsBaseApiEvent<TB> {
  action: 'create' | 'update' | 'delete';
  body: TB | null;
  keys: string[];

  constructor(
    action: 'create' | 'update' | 'delete',
    body: TB | null,
    keys?: string[]) {
    this.action = action;
    this.body = body;
    this.keys = keys ? keys : [];
  }
}
