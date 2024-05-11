export interface IAlphaPrimeSelectOption {
  id: string;
  caption: any;
  disabled: boolean;
  data?: any;
}

export class AlphaPrimeSelectInfo {
  /** determine how to set the initial option Id out of 8 options:
   *
   * 'first': first,
   * 'none': undefined,
   * 'idOrNone': id if found,
   * 'idOrFirst': id or first.
   *
   * 'lsOrFirst': localStorage item or first,
   * 'lsOrNone' : localStorage item if found,
   * 'lsOrIdOrNone': localStorage item or id if found,
   * 'lsOrIdOrFirst': localStorage item or id or first.
   *
   * The default value is 'first' */
  initMode: 'first' | 'none' | 'idOrNone' | 'idOrFirst'
    | 'lsOrFirst' | 'lsOrNone' | 'lsOrIdOrNone' | 'lsOrIdOrFirst';
  options: IAlphaPrimeSelectOption[] = [];
  /** key if the localStorage item to retrieved/set */
  lsItemKey: string | undefined;

  /** initial value */
  optionId: string | undefined;

  getOption(optionId: string | undefined) {
    if (optionId === undefined) {
      return undefined;
    }
    const option = this.options.find(o => o.id === optionId);
    if (option === undefined) {
      throw new Error('option should not be undefined');
    }
    return option;
  }

  static First(
    options: IAlphaPrimeSelectOption[]): AlphaPrimeSelectInfo {
    return new AlphaPrimeSelectInfo(
      'first', options)
  }

  static None(
    options: IAlphaPrimeSelectOption[]): AlphaPrimeSelectInfo {
    return new AlphaPrimeSelectInfo(
      'none', options);
  }

  static OptionId(
    options: IAlphaPrimeSelectOption[],
    optionId: string | undefined):AlphaPrimeSelectInfo {
    return new AlphaPrimeSelectInfo(
      'idOrNone', options, undefined, optionId);
  }

  static OptionIdOrFirst(
    options: IAlphaPrimeSelectOption[],
    optionId: string | undefined):AlphaPrimeSelectInfo {
    return new AlphaPrimeSelectInfo(
      'idOrFirst', options, undefined, optionId);
  }

  static LsOrFirst(options: IAlphaPrimeSelectOption[],
                   lsItemKey: string): AlphaPrimeSelectInfo {
    return new AlphaPrimeSelectInfo(
      'lsOrFirst', options, lsItemKey);
  }

  static LsOrNone(options: IAlphaPrimeSelectOption[],
                  lsItemKey: string):AlphaPrimeSelectInfo {
    return new AlphaPrimeSelectInfo(
      'lsOrNone', options, lsItemKey);
  }

  static LsOrIdOrFirst(options: IAlphaPrimeSelectOption[],
                       lsItemKey: string,
                       optionId: string | undefined): AlphaPrimeSelectInfo {
    return new AlphaPrimeSelectInfo(
      'lsOrIdOrFirst', options, lsItemKey, optionId);
  }

  static LsOrIdOrNone(options: IAlphaPrimeSelectOption[],
                      lsItemKey: string,
                      optionId: string | undefined):AlphaPrimeSelectInfo {
    return new AlphaPrimeSelectInfo(
      'lsOrIdOrNone', options, lsItemKey, optionId);
  }

  private setIdOrNone(id: string | undefined): void {
    const option = id
      ? this.options.find(o => o.id === id)
      : undefined;
    this.optionId = option?.id;
  }

  private setFirst(): void {
    this.optionId = this.options.length > 0
      ? this.options[0].id
      : undefined;
  }

  private setIdOrFirst(id: string | undefined): void {
    this.setIdOrNone(id);
    if (this.optionId) {
      return;
    }
    this.setFirst();
  }

  private setLsOrNone(lsItemKey: string): void {
    const lsId = localStorage.getItem(lsItemKey!) || undefined;
    this.setIdOrNone(lsId);
  }

  private setLsOrFirst(lsItemKey: string): void {
    const lsId = localStorage.getItem(lsItemKey!) || undefined;
    this.setIdOrFirst(lsId);
  }

  private setLsOrIdOrNone(lsItemKey: string, id: string | undefined) {
    const lsId = localStorage.getItem(lsItemKey!) || undefined;
    this.setIdOrNone(lsId || id);
  }

  private setLsOrIdOrFirst(lsItemKey: string, id: string | undefined) {
    const lsId = localStorage.getItem(lsItemKey!) || undefined;
    this.setIdOrFirst(lsId || id);
  }

  private constructor(
    initMode: 'first' | 'none' | 'idOrNone' | 'idOrFirst'
      | 'lsOrFirst' | 'lsOrNone' | 'lsOrIdOrNone' | 'lsOrIdOrFirst',
    options: IAlphaPrimeSelectOption[],
    lsItemKey?: string,
    id?: string) {

    this.initMode = initMode;
    this.options = options;
    this.lsItemKey = lsItemKey;
    this.optionId = id;

    switch (initMode) {
      case 'first':
        this.setFirst();
        break;
      case 'none':
        this.optionId = undefined;
        break;
      case 'idOrNone':
        this.setIdOrNone(id);
        break;
      case 'idOrFirst':
        this.setIdOrFirst(id);
        break;

      case 'lsOrFirst':
        this.setLsOrFirst(lsItemKey!);
        break;
      case 'lsOrNone':
        this.setLsOrNone(lsItemKey!);
        break;
      case 'lsOrIdOrNone':
        this.setLsOrIdOrNone(lsItemKey!, id)
        break;
      case 'lsOrIdOrFirst':
        this.setLsOrIdOrFirst(lsItemKey!, id);
        break;
    }
  }
}
