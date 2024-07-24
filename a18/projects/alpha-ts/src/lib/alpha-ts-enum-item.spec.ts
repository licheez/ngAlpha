import {AlphaTsEnumItemFactory, IAlphaTsEnumItem} from "./alpha-ts-enum-item";

describe('AlphaTsEnumItem', () => {
  enum testEnum {
    one
  }

  it('should factor an instance', () => {
    const code = 'item 0 code';
    const caption = 'item 0 caption en';
    const value = testEnum.one;

    const enumDso = {
      code: code,
      caption: caption
    };

    const r: IAlphaTsEnumItem<testEnum> = AlphaTsEnumItemFactory
      .factor<testEnum>(enumDso, () => value);

    expect(r.code).toEqual(code);
    expect(r.caption).toEqual(caption);
    expect(r.value).toEqual(value);
  });
});
