/**
 * This is a wrapper around an enumeration item that contains a code, a value,
 * and a translated caption.
 *
 * @template T - The type of the wrapped enumeration.
 */
export interface IAlphaTsEnumItem<T> {
  code: string;
  value: T;
  caption: string;
}

/**
 * Represents a factory for creating instances of AlphaTsEnum.
 */
export class AlphaTsEnumItemFactory {
  /**
   * Creates an instance of an AlphaTsEnum by using the provided enumDso and getValue function.
   *
   * @template T - The type of the enum values.
   * @param {object} enumDso - An object containing the code and translated caption properties of the enum.
   * @param {string} enumDso.code - The code property of the enum.
   * @param {string} enumDso.caption - The translated caption property of the enum.
   * @param {function} getValue - A function that retrieves the value of the enum based on its code.
   * @returns {IAlphaTsEnumItem<T>} - A new instance of the AlphaTsEnum class.
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
class GenEnum<T> implements IAlphaTsEnumItem<T> {
  code: string;
  value: T;
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
