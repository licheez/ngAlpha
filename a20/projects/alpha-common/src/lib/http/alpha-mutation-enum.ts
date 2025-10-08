/**
 * Enum representing mutation types for API operations.
 * - None: No mutation
 * - Create: Create operation
 * - Update: Update operation
 * - Deactivate: Deactivate operation
 */
export enum AlphaMutationEnum {
  None,
  Create,
  Update,
  Deactivate
}

/**
 * Utility class for mapping AlphaMutationEnum values to codes and names, and vice versa.
 * Provides static methods for code conversion, name retrieval, and value lookup.
 */
export class AlphaEnumMutation {
  private static readonly None = 'N';
  private static readonly Create = 'C';
  private static readonly Update = 'U';
  private static readonly Deactivate = 'D';

  /**
   * Gets the code string for a given AlphaMutationEnum value.
   * @param value - The mutation enum value.
   * @returns The corresponding code string.
   * @throws RangeError if the value is invalid.
   */
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

  /**
   * Gets the display name for a given AlphaMutationEnum value.
   * @param value - The mutation enum value.
   * @returns The corresponding display name, or empty string for None.
   * @throws RangeError if the value is invalid.
   */
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

  /**
   * Gets the AlphaMutationEnum value for a given code string.
   * @param code - The code string.
   * @returns The corresponding AlphaMutationEnum value.
   * @throws RangeError if the code is invalid.
   */
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
