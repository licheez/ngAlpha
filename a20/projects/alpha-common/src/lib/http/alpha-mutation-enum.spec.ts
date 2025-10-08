import { AlphaMutationEnum, AlphaEnumMutation } from './alpha-mutation-enum';

describe('AlphaMutationEnum', () => {
  it('should have correct enum values', () => {
    expect(AlphaMutationEnum.None).toBe(0);
    expect(AlphaMutationEnum.Create).toBe(1);
    expect(AlphaMutationEnum.Update).toBe(2);
    expect(AlphaMutationEnum.Deactivate).toBe(3);
  });
});

describe('AlphaEnumMutation', () => {
  it('getCode should return correct code for each enum value', () => {
    expect(AlphaEnumMutation.getCode(AlphaMutationEnum.None)).toBe('N');
    expect(AlphaEnumMutation.getCode(AlphaMutationEnum.Create)).toBe('C');
    expect(AlphaEnumMutation.getCode(AlphaMutationEnum.Update)).toBe('U');
    expect(AlphaEnumMutation.getCode(AlphaMutationEnum.Deactivate)).toBe('D');
  });

  it('getCode should throw on invalid enum value', () => {
    expect(() => AlphaEnumMutation.getCode(999 as AlphaMutationEnum)).toThrowError('invalid mutationEnum value 999');
  });

  it('getName should return correct name for each enum value', () => {
    expect(AlphaEnumMutation.getName(AlphaMutationEnum.None)).toBe('');
    expect(AlphaEnumMutation.getName(AlphaMutationEnum.Create)).toBe('Create');
    expect(AlphaEnumMutation.getName(AlphaMutationEnum.Update)).toBe('Update');
    expect(AlphaEnumMutation.getName(AlphaMutationEnum.Deactivate)).toBe('Deactivate');
  });

  it('getName should throw on invalid enum value', () => {
    expect(() => AlphaEnumMutation.getName(999 as AlphaMutationEnum)).toThrowError('invalid mutationEnum value 999');
  });

  it('getValue should return correct enum for each code', () => {
    expect(AlphaEnumMutation.getValue('N')).toBe(AlphaMutationEnum.None);
    expect(AlphaEnumMutation.getValue('C')).toBe(AlphaMutationEnum.Create);
    expect(AlphaEnumMutation.getValue('U')).toBe(AlphaMutationEnum.Update);
    expect(AlphaEnumMutation.getValue('D')).toBe(AlphaMutationEnum.Deactivate);
  });

  it('getValue should throw on invalid code', () => {
    expect(() => AlphaEnumMutation.getValue('X')).toThrowError('invalid mutationEnum code X');
  });
});

