/**
 * Represents a wrapper around an enumeration item, containing a code, a value, and a translated caption.
 *
 * @template T - The type of the wrapped enumeration value.
 */
export interface IAlphaTsEnumItem<T> {
  /**
   * The code identifying the enum item.
   */
  code: string;
  /**
   * The value of the enum item.
   */
  value: T;
  /**
   * The translated caption for the enum item.
   */
  caption: string;
}

/**
 * Factory for creating instances of IAlphaTsEnumItem.
 */
export class AlphaTsEnumItemFactory {
  /**
   * Creates an instance of IAlphaTsEnumItem using the provided enumDso and getValue function.
   *
   * @template T - The type of the enum values.
   * @param enumDso - An object containing the code and translated caption properties of the enum.
   * @param getValue - A function that retrieves the value of the enum based on its code.
   * @returns A new instance of IAlphaTsEnumItem.
   */
  static factor<T>(
    enumDso: { code: string, caption: string },
    getValue: (code: string) => T): IAlphaTsEnumItem<T> {
    return new GenEnum<T>(
      enumDso.code,
      getValue(enumDso.code),
      enumDso.caption);
  }
}

// CONCRETE
/**
 * Concrete implementation of IAlphaTsEnumItem.
 * Used internally by the factory.
 *
 * @template T - The type of the enum value.
 */
class GenEnum<T> implements IAlphaTsEnumItem<T> {
  /**
   * The code identifying the enum item.
   */
  code: string;
  /**
   * The value of the enum item.
   */
  value: T;
  /**
   * The translated caption for the enum item.
   */
  caption: string;

  constructor(
    code: string,
    value: T,
    caption: string) {
    this.code = code;
    this.value = value;
    this.caption = caption;
  }
}
