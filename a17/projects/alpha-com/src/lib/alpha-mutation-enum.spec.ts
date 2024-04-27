import {describe, expect, it} from "@jest/globals";
import {AlphaEnumMutation, AlphaMutationEnum} from "./alpha-mutation-enum";

describe('AlphaEnumMutation class', () => {

  it('getCode method should return the correct code for given AlphaMutationEnum value', () => {
    expect(AlphaEnumMutation.getCode(AlphaMutationEnum.None)).toEqual('N');
    expect(AlphaEnumMutation.getCode(AlphaMutationEnum.Create)).toEqual('C');
    expect(AlphaEnumMutation.getCode(AlphaMutationEnum.Update)).toEqual('U');
    expect(AlphaEnumMutation.getCode(AlphaMutationEnum.Deactivate)).toEqual('D');
    expect(() => AlphaEnumMutation.getCode(5 as AlphaMutationEnum)).toThrow(RangeError);
  });

  it('getName method should return the correct name for given AlphaMutationEnum value', () => {
    expect(AlphaEnumMutation.getName(AlphaMutationEnum.None)).toEqual('');
    expect(AlphaEnumMutation.getName(AlphaMutationEnum.Create)).toEqual('Create');
    expect(AlphaEnumMutation.getName(AlphaMutationEnum.Update)).toEqual('Update');
    expect(AlphaEnumMutation.getName(AlphaMutationEnum.Deactivate)).toEqual('Deactivate');
    expect(() => AlphaEnumMutation.getName(5 as AlphaMutationEnum)).toThrow(RangeError);
  });

  it('getValue method should return the correct AlphaMutationEnum for given code', () => {
    expect(AlphaEnumMutation.getValue('N')).toEqual(AlphaMutationEnum.None);
    expect(AlphaEnumMutation.getValue('C')).toEqual(AlphaMutationEnum.Create);
    expect(AlphaEnumMutation.getValue('U')).toEqual(AlphaMutationEnum.Update);
    expect(AlphaEnumMutation.getValue('D')).toEqual(AlphaMutationEnum.Deactivate);
    expect(() => AlphaEnumMutation.getValue('Z')).toThrow(RangeError);
  });

});
