
export enum AlphaMutationEnum {
  None,
  Create,
  Update,
  Deactivate
}

export class AlphaEnumMutation {
  private static readonly None = 'N';
  private static readonly Create = 'C';
  private static readonly Update = 'U';
  private static readonly Deactivate = 'D';

  static getCode(value: AlphaMutationEnum): string {
    switch (value) {
      case AlphaMutationEnum.None:
        return AlphaEnumMutation.None;
      case AlphaMutationEnum.Create:
        return AlphaEnumMutation.Create;
      case AlphaMutationEnum.Update:
        return AlphaEnumMutation.Update;
      case AlphaMutationEnum.Deactivate:
        return AlphaEnumMutation.Deactivate;
      default:
        throw new RangeError('invalid mutationEnum value ' + value);
    }
  }

  static getName(value: AlphaMutationEnum): string {
    switch (value) {
      case AlphaMutationEnum.None:
        return '';
      case AlphaMutationEnum.Create:
        return 'Create';
      case AlphaMutationEnum.Update:
        return 'Update';
      case AlphaMutationEnum.Deactivate:
        return 'Deactivate';
      default:
        throw new RangeError('invalid mutationEnum value ' + value);
    }
  }


  static getValue(code: string): AlphaMutationEnum {
    switch (code) {
      case AlphaEnumMutation.None:
        return AlphaMutationEnum.None;
      case AlphaEnumMutation.Create:
        return AlphaMutationEnum.Create;
      case AlphaEnumMutation.Update:
        return AlphaMutationEnum.Update;
      case AlphaEnumMutation.Deactivate:
        return AlphaMutationEnum.Deactivate;
      default:
        throw new RangeError('invalid mutationEnum code ' + code);
    }
  }
}
